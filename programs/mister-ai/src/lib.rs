use anchor_lang::prelude::*;

declare_id!("AWWPBKCrgeyRyzPHyWgrwK2uWJoXdwEpH6xcBZaH8oMj");

#[program]
pub mod mister_ai {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
