import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MisterAi } from "../target/types/mister_ai";

describe("mister-ai", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.MisterAi as Program<MisterAi>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
