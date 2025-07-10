class EmailProviderB {
    constructor() {
      this.forceFail = false; 
    }
  
    async send(email) {
      try {
        if (this.forceFail) {
          throw new Error("Provider B failed (forced)");
        }
        return {
          success: true,
          provider: 'ProviderB',
          message: `Email sent to ${email.to} by ProviderB`,
        };
      } catch (err) {
        console.error("[ProviderB Error]:", err.message);
        throw err;
      }
    }
  }
  
  module.exports = EmailProviderB;
  