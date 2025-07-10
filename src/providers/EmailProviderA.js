class EmailProviderA {
    constructor() {
      this.forceFail = true; 
    }
  
    async send(email) {
      try {
        if (this.forceFail) {
          throw new Error("Provider A failed (forced)");
        }
        return {
          success: true,
          provider: 'ProviderA',
          message: `Email sent to ${email.to} by ProviderA`,
        };
      } catch (err) {
        console.error("[ProviderA Error]:", err.message);
        throw err; // Re-throw for EmailService to handle
      }
    }
  }
  
  module.exports = EmailProviderA;
  