import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MisterAi } from "../target/types/mister_ai";

async function main() {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.MisterAi as Program<MisterAi>;
    console.log("Program ID:", program.programId.toString());

    try {
        const tx = await program.methods
            .createGame()
            .accounts({
                payer: provider.wallet.publicKey,
            })
            .rpc();

        console.log("Your transaction signature", tx);
    } catch (error) {
        console.error("Error:", error);
        console.log("Provider wallet:", provider.wallet.publicKey.toString());
    }
}

main();