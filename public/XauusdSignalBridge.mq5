//+------------------------------------------------------------------+
//|                                       XauusdSignalBridge.mq5     |
//|  Sample EA: posts BUY/SELL signals + trade outcomes to a webhook |
//|  Strategy: EMA(9) / EMA(21) crossover with RSI(14) filter        |
//|                                                                  |
//|  IMPORTANT: This is a STARTER TEMPLATE. It is NOT a guaranteed   |
//|  profitable strategy. Test on a demo account first. Markets are  |
//|  probabilistic — no system can give "100% precise" signals.      |
//+------------------------------------------------------------------+
#property copyright "Lovable - XAUUSD Signal Bridge"
#property version   "1.00"
#property strict

#include <Trade\Trade.mqh>

//--- Inputs
input string  WebhookURL      = "https://cwbjrzumqonfyufoyjer.supabase.co/functions/v1/mt5-webhook";
input string  WebhookSecret   = "PASTE_YOUR_SECRET_HERE"; // must match MT5_WEBHOOK_SECRET in Lovable
input string  Symbol_         = "XAUUSD";
input ENUM_TIMEFRAMES TF      = PERIOD_M15;
input int     EmaFast         = 9;
input int     EmaSlow         = 21;
input int     RsiPeriod       = 14;
input double  RsiBuyMin       = 50.0;   // RSI must be above this to BUY
input double  RsiSellMax      = 50.0;   // RSI must be below this to SELL
input double  Lots            = 0.10;
input int     SL_Pips         = 200;    // 200 "pips" of 0.1 USD = $20 SL on XAU
input int     TP_Pips         = 400;
input bool    PlaceOrders     = true;   // false = signal-only, no actual orders

CTrade trade;

//--- handles
int hEmaFast = INVALID_HANDLE;
int hEmaSlow = INVALID_HANDLE;
int hRsi     = INVALID_HANDLE;

datetime lastBarTime = 0;

//+------------------------------------------------------------------+
int OnInit()
{
   hEmaFast = iMA(Symbol_, TF, EmaFast, 0, MODE_EMA, PRICE_CLOSE);
   hEmaSlow = iMA(Symbol_, TF, EmaSlow, 0, MODE_EMA, PRICE_CLOSE);
   hRsi     = iRSI(Symbol_, TF, RsiPeriod, PRICE_CLOSE);
   if(hEmaFast == INVALID_HANDLE || hEmaSlow == INVALID_HANDLE || hRsi == INVALID_HANDLE)
   {
      Print("Indicator init failed");
      return INIT_FAILED;
   }
   return INIT_SUCCEEDED;
}

void OnDeinit(const int reason)
{
   if(hEmaFast != INVALID_HANDLE) IndicatorRelease(hEmaFast);
   if(hEmaSlow != INVALID_HANDLE) IndicatorRelease(hEmaSlow);
   if(hRsi     != INVALID_HANDLE) IndicatorRelease(hRsi);
}

//+------------------------------------------------------------------+
//| Detect new bar                                                   |
//+------------------------------------------------------------------+
bool IsNewBar()
{
   datetime t = iTime(Symbol_, TF, 0);
   if(t != lastBarTime)
   {
      lastBarTime = t;
      return true;
   }
   return false;
}

//+------------------------------------------------------------------+
//| Pip size for XAUUSD ~ 0.1 (broker dependent)                     |
//+------------------------------------------------------------------+
double PipSize()
{
   double point = SymbolInfoDouble(Symbol_, SYMBOL_POINT);
   int    digits = (int)SymbolInfoInteger(Symbol_, SYMBOL_DIGITS);
   // For 5/3-digit brokers, 1 pip = 10 * point. For XAUUSD 2-digit, treat 1 pip = 0.1.
   if(digits == 3 || digits == 5) return 10.0 * point;
   if(StringFind(Symbol_, "XAU") >= 0) return 0.1;
   return point;
}

//+------------------------------------------------------------------+
//| Send JSON via WebRequest                                         |
//+------------------------------------------------------------------+
bool PostJson(string body)
{
   char post[];
   StringToCharArray(body, post, 0, StringLen(body), CP_UTF8);
   ArrayResize(post, ArraySize(post) - 1);

   string headers = "Content-Type: application/json\r\nx-webhook-secret: " + WebhookSecret + "\r\n";
   char   result[];
   string resHeaders;
   int    timeout = 5000;

   ResetLastError();
   int code = WebRequest("POST", WebhookURL, headers, timeout, post, result, resHeaders);
   if(code == -1)
   {
      Print("WebRequest failed: ", GetLastError(),
            " — check Tools > Options > Expert Advisors and add the URL to the allow list.");
      return false;
   }
   if(code >= 200 && code < 300) return true;
   string resp = CharArrayToString(result);
   Print("Webhook responded ", code, ": ", resp);
   return false;
}

//+------------------------------------------------------------------+
//| Build & send signal                                              |
//+------------------------------------------------------------------+
void SendSignal(string side, double entry, double sl, double tp, long ticket, double rsiVal)
{
   string body = StringFormat(
      "{\"type\":\"signal\",\"symbol\":\"%s\",\"side\":\"%s\",\"entry\":%.5f,\"sl\":%.5f,\"tp\":%.5f,\"confidence\":%.1f,\"strategy\":\"EMA%d/EMA%d + RSI%d\",\"ticket\":%I64d}",
      Symbol_, side, entry, sl, tp, rsiVal, EmaFast, EmaSlow, RsiPeriod, ticket);
   PostJson(body);
}

void SendOutcome(long ticket, string side, double entry, double exit, string outcome, double profit)
{
   string body = StringFormat(
      "{\"type\":\"outcome\",\"symbol\":\"%s\",\"side\":\"%s\",\"entry\":%.5f,\"exit\":%.5f,\"outcome\":\"%s\",\"profit\":%.2f,\"ticket\":%I64d}",
      Symbol_, side, entry, exit, outcome, profit, ticket);
   PostJson(body);
}

//+------------------------------------------------------------------+
//| Detect closed positions and report outcomes                      |
//+------------------------------------------------------------------+
datetime lastCheck = 0;
void CheckClosedDeals()
{
   datetime now = TimeCurrent();
   if(lastCheck == 0) { lastCheck = now - 60; return; }
   HistorySelect(lastCheck, now + 1);
   int total = HistoryDealsTotal();
   for(int i = 0; i < total; i++)
   {
      ulong dealTicket = HistoryDealGetTicket(i);
      if(dealTicket == 0) continue;
      long entry = HistoryDealGetInteger(dealTicket, DEAL_ENTRY);
      if(entry != DEAL_ENTRY_OUT) continue; // only closing deals
      string sym = HistoryDealGetString(dealTicket, DEAL_SYMBOL);
      if(sym != Symbol_) continue;

      long posId   = HistoryDealGetInteger(dealTicket, DEAL_POSITION_ID);
      long type    = HistoryDealGetInteger(dealTicket, DEAL_TYPE);
      double price = HistoryDealGetDouble(dealTicket, DEAL_PRICE);
      double profit= HistoryDealGetDouble(dealTicket, DEAL_PROFIT)
                   + HistoryDealGetDouble(dealTicket, DEAL_SWAP)
                   + HistoryDealGetDouble(dealTicket, DEAL_COMMISSION);

      // find matching open deal to get entry price
      double entryPrice = 0;
      string side = "";
      for(int j = 0; j < total; j++)
      {
         ulong dt = HistoryDealGetTicket(j);
         if(HistoryDealGetInteger(dt, DEAL_POSITION_ID) == posId &&
            HistoryDealGetInteger(dt, DEAL_ENTRY) == DEAL_ENTRY_IN)
         {
            entryPrice = HistoryDealGetDouble(dt, DEAL_PRICE);
            long openType = HistoryDealGetInteger(dt, DEAL_TYPE);
            side = (openType == DEAL_TYPE_BUY) ? "BUY" : "SELL";
            break;
         }
      }
      if(entryPrice == 0) continue;

      string outcome = (profit > 0.01) ? "win" : (profit < -0.01 ? "loss" : "breakeven");
      SendOutcome(posId, side, entryPrice, price, outcome, profit);
   }
   lastCheck = now;
}

//+------------------------------------------------------------------+
void OnTick()
{
   CheckClosedDeals();

   if(!IsNewBar()) return;

   double emaF[2], emaS[2], rsi[2];
   if(CopyBuffer(hEmaFast, 0, 1, 2, emaF) <= 0) return;
   if(CopyBuffer(hEmaSlow, 0, 1, 2, emaS) <= 0) return;
   if(CopyBuffer(hRsi,     0, 1, 2, rsi)  <= 0) return;

   bool crossUp   = emaF[1] <= emaS[1] && emaF[0] >  emaS[0];
   bool crossDown = emaF[1] >= emaS[1] && emaF[0] <  emaS[0];

   double pip   = PipSize();
   double ask   = SymbolInfoDouble(Symbol_, SYMBOL_ASK);
   double bid   = SymbolInfoDouble(Symbol_, SYMBOL_BID);
   long   ticket = 0;

   if(crossUp && rsi[0] >= RsiBuyMin)
   {
      double entry = ask;
      double sl    = entry - SL_Pips * pip;
      double tp    = entry + TP_Pips * pip;
      if(PlaceOrders && trade.Buy(Lots, Symbol_, entry, sl, tp, "XauBridge"))
         ticket = (long)trade.ResultOrder();
      SendSignal("BUY", entry, sl, tp, ticket, rsi[0]);
   }
   else if(crossDown && rsi[0] <= RsiSellMax)
   {
      double entry = bid;
      double sl    = entry + SL_Pips * pip;
      double tp    = entry - TP_Pips * pip;
      if(PlaceOrders && trade.Sell(Lots, Symbol_, entry, sl, tp, "XauBridge"))
         ticket = (long)trade.ResultOrder();
      SendSignal("SELL", entry, sl, tp, ticket, rsi[0]);
   }
}
//+------------------------------------------------------------------+
