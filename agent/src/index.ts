import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import type { MisterAi } from "./idl/mister_ai";
import idl from "../../target/idl/mister_ai.json";
import dotenv from 'dotenv';
import { createHash } from 'crypto';

dotenv.config();

// Constants
const INTERVAL_MINUTES = 1; // Set to 1 for minute intervals, 60 for hourly
const CITIES = ["Berlin", "Lisbon", "Singapore", "Bangkok", "New York", "Bogota", "Dubai", "Cape Town"];

class MisterXBot {
    private program: Program<MisterAi>;
    private currentLocation: number = 0;

    constructor() {
        // Initialize connection
        const connection = new Connection(
            process.env.RPC_URL || clusterApiUrl("devnet"),
            "confirmed"
        );

        // Initialize wallet from environment
        const keypair = Keypair.fromSecretKey(
            new Uint8Array(JSON.parse(process.env.PRIVATE_KEY || '[]'))
        );
        const wallet = new Wallet(keypair);

        // Create provider
        const provider = new AnchorProvider(connection, wallet, {
            commitment: "confirmed",
            preflightCommitment: "confirmed",
        });

        // Initialize program
        this.program = new Program<MisterAi>(
            idl as any,
            provider
        );
    }

    private getNextInterval(): Date {
        const now = new Date();
        const next = new Date(now);

        // Reset seconds and milliseconds
        next.setSeconds(0);
        next.setMilliseconds(0);

        // Round up to next interval
        const currentMinute = next.getMinutes();
        const minutesToAdd = INTERVAL_MINUTES - (currentMinute % INTERVAL_MINUTES);
        next.setMinutes(currentMinute + minutesToAdd);

        return next;
    }

    private async scheduleNextTurn() {
        const now = new Date();
        const nextTurn = this.getNextInterval();
        const delay = nextTurn.getTime() - now.getTime();

        console.log(`Next turn scheduled for: ${nextTurn.toLocaleString()}`);

        setTimeout(async () => {
            await this.makeTurn();
            this.scheduleNextTurn(); // Schedule next turn after completing this one
        }, delay);
    }

    private generateNextMove(): number {
        const possibleMoves = this.getConnectedCities(this.currentLocation);
        const nextLocation = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        return nextLocation;
    }

    private getConnectedCities(location: number): number[] {
        return [0, 1, 2, 3, 4, 5, 6, 7].filter(city => city !== location);
    }

    private generateClue(): string {
        const city = CITIES[this.currentLocation];
        return `The wind whispers of ${city.charAt(0)}...`;
    }

    private hashData(data: string): Buffer {
        return createHash('sha256').update(data).digest();
    }

    async makeTurn() {
        // TODO
    }

    async start() {
        console.log('Starting Mister X bot...');
        console.log(`Interval set to: ${INTERVAL_MINUTES} minutes`);

        // Schedule the first turn
        await this.scheduleNextTurn();
    }

    async surrender(winner: PublicKey) {
        // TODO
    }
}

// Error handling and graceful shutdown
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Performing graceful shutdown...');
    process.exit(0);
});

// Start the bot
const bot = new MisterXBot();
bot.start().catch((error) => {
    console.error('Failed to start bot:', error);
    process.exit(1);
});