using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CentromedicoCliente.Services.Helpers
{
    public class TwilioSettings
    {
        string accountSid = "YOUR_TWILIO_ACCOUNT_SID";
        string authToken = "YOUR_TWILIO_AUTH_TOKEN";

        public  string AccountSid { get { return accountSid; } set { accountSid = value; } }
        public  string AuthToken { get { return authToken; } set { authToken = value; } }
 
    }
}
