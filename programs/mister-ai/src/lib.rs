use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("Hm4UThjiWe5xdQ6ezkmReuZZ9Wn628WDoQ1d9mAxpBmp");

#[program]
pub mod mister_ai {
    use super::*;

    pub fn create_game(ctx: Context<CreateGame>) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        game_state.authority = ctx.accounts.payer.key();

        Ok(())
    }

    // - Mister AI -
    pub fn mister_ai_move(
        ctx: Context<MisterAiMove>,
        clue_hash: [u8; 32],
        moves_hash: [u8; 32],
    ) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;

        let position_report = &mut ctx.accounts.position_report;
        position_report.round = game_state.round + 1;
        position_report.clue_hash = clue_hash;
        position_report.moves_hash = moves_hash;

        game_state.round += 1;

        Ok(())
    }

    // AI surenders because someone has caught them
    pub fn mister_ai_surender(ctx: Context<MisterAiSurender>) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        let pot = game_state.pot;

        transfer_lamports(&ctx.accounts.authority, &ctx.accounts.winner, pot)?;
        Ok(())
    }

    // - Player -
    pub fn join_game(ctx: Context<JoinGame>) -> Result<()> {
        // pay the fee
        transfer_lamports(&ctx.accounts.payer, &ctx.accounts.system_program, JOIN_FEE)?;

        Ok(())
    }

    pub fn move_to(ctx: Context<MoveTo>, new_location: u8) -> Result<()> {
        let player_state = &mut ctx.accounts.player_state;
        let game_state = &mut ctx.accounts.game_state;

        if !can_play(player_state, game_state) {
            return Err(MisterAiError::NotAllowedToPlay.into());
        }

        // check if the move is valid
        let cost = find_connection_cost(player_state.location, new_location);
        if cost == 0 {
            return Err(MisterAiError::InvalidMove.into());
        }
        // TODO: do sth with cost

        // pay the fee
        transfer_lamports(&ctx.accounts.payer, &ctx.accounts.system_program, MOVE_FEE)?;
        player_state.pot_contribution += MOVE_FEE;

        // update the player's location
        player_state.location = new_location;
        player_state.last_round_played = game_state.round;

        Ok(())
    }

    pub fn search_location(ctx: Context<SearchLocation>) -> Result<()> {
        let player_state = &mut ctx.accounts.player_state;
        let game_state = &mut ctx.accounts.game_state;

        if !can_play(player_state, game_state) {
            return Err(MisterAiError::NotAllowedToPlay.into());
        }

        // pay the fee
        transfer_lamports(
            &ctx.accounts.payer,
            &ctx.accounts.system_program,
            SEARCH_FEE,
        )?;
        player_state.pot_contribution += SEARCH_FEE;

        // update the player's search status
        player_state.has_searched = true;
        player_state.last_round_played = game_state.round;

        Ok(())
    }
}

// -------------------------- Constants & Utilities --------------------------

const JOIN_FEE: u64 = 1_000_000; // e.g., 0.001 SOL
const MOVE_FEE: u64 = 500_000; // e.g., 0.0005 SOL
const STAY_FEE: u64 = 200_000; // e.g., 0.0002 SOL
const SEARCH_FEE: u64 = 1_000_000; // e.g., 0.001 SOL
const MR_AI_FEE_PCT: u8 = 1; // 1% of the total pot

/// Transfer lamports from `from` to `to` PDAs.
fn transfer_lamports<'a>(from: &Signer<'a>, to: &AccountInfo<'a>, amount: u64) -> Result<()> {
    let ix =
        anchor_lang::solana_program::system_instruction::transfer(&from.key(), &to.key(), amount);
    anchor_lang::solana_program::program::invoke(&ix, &[from.to_account_info(), to.clone()])?;
    Ok(())
}

// find the cost of the connection between two locations, if no connection is found, return 0
fn find_connection_cost(current_location: u8, new_location: u8) -> u8 {
    for edge in CITY_GRAPH {
        if edge[0] == current_location && edge[1] == new_location {
            return edge[2];
        }
    }

    return 0;
}

fn can_play(player_state: &PlayerState, game_state: &GameState) -> bool {
    player_state.last_round_played < game_state.round
}

// Errors
#[error_code]
pub enum MisterAiError {
    #[msg("Invalid move between locations")]
    InvalidMove,
    #[msg("Not allowed to play")]
    NotAllowedToPlay,
}

// -------------------------- Accounts --------------------------
#[derive(Accounts)]
pub struct CreateGame<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + std::mem::size_of::<GameState>(),
        seeds = [b"game_state"],
        bump
    )]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MisterAiMove<'info> {
    #[account(mut)]
    pub game_state: Account<'info, GameState>,

    #[account(
        init,
        payer = signer,
        space = 8 + std::mem::size_of::<MrAIPositionReport>(),
        seeds = [b"position"],
        bump
    )]
    pub position_report: Account<'info, MrAIPositionReport>,

    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MisterAiSurender<'info> {
    #[account(mut)]
    pub game_state: Account<'info, GameState>,

    /// CHECK: This account is not read or written, it just receives SOL
    #[account(mut)]
    pub winner: AccountInfo<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinGame<'info> {
    #[account(mut)]
    pub game_state: Account<'info, GameState>,

    #[account(
        init,
        payer = payer,
        space = 8 + std::mem::size_of::<PlayerState>(),
        seeds = [b"player"],
        bump
    )]
    pub player_state: Account<'info, PlayerState>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MoveTo<'info> {
    #[account(mut)]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub player_state: Account<'info, PlayerState>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SearchLocation<'info> {
    #[account(mut)]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub player_state: Account<'info, PlayerState>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

// -------------------------- Data Structs --------------------------

#[account]
#[derive(Default)]
pub struct GameState {
    pub authority: Pubkey,
    pub pot: u64,
    pub round: u64,
    pub start_at: u64,
    pub end_at: u64,
}

#[account]
#[derive(Default)]
pub struct MrAIPositionReport {
    pub round: u64,
    pub clue_hash: [u8; 32],
    pub moves_hash: [u8; 32],
}

#[account]
#[derive(Default)]
pub struct PlayerState {
    pub location: u8,
    pub last_round_played: u64,
    pub pot_contribution: u64,
    pub has_searched: bool,
}

// -------------------------- Game data --------------------------
const CITY_GRAPH: [[u8; 3]; 9] = [
    [0, 1, 10],
    [1, 2, 10],
    [2, 3, 10],
    [3, 4, 10],
    [4, 5, 10],
    [5, 6, 10],
    [6, 7, 10],
    [8, 9, 10],
    [9, 0, 10],
];
