/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/mister_ai.json`.
 */
export type MisterAi = {
  "address": "HwKzcL5wbjbS14mzZa1oFC7oSyK87c9htvfrTs7Eq8X1",
  "metadata": {
    "name": "misterAi",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createGame",
      "discriminator": [
        124,
        69,
        75,
        66,
        184,
        220,
        72,
        206
      ],
      "accounts": [
        {
          "name": "gameState",
          "writable": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "joinGame",
      "discriminator": [
        107,
        112,
        18,
        38,
        56,
        173,
        60,
        128
      ],
      "accounts": [
        {
          "name": "gameState",
          "writable": true
        },
        {
          "name": "playerState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  121,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "misterAiMove",
      "discriminator": [
        91,
        70,
        173,
        95,
        198,
        156,
        22,
        200
      ],
      "accounts": [
        {
          "name": "gameState",
          "writable": true
        },
        {
          "name": "positionReport",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "clueHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "movesHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "misterAiSurender",
      "discriminator": [
        129,
        133,
        164,
        125,
        28,
        13,
        5,
        97
      ],
      "accounts": [
        {
          "name": "gameState",
          "writable": true
        },
        {
          "name": "winner",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "moveTo",
      "discriminator": [
        203,
        97,
        69,
        158,
        17,
        230,
        3,
        142
      ],
      "accounts": [
        {
          "name": "gameState",
          "writable": true
        },
        {
          "name": "playerState",
          "writable": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "newLocation",
          "type": "u8"
        }
      ]
    },
    {
      "name": "searchLocation",
      "discriminator": [
        113,
        52,
        96,
        210,
        124,
        254,
        56,
        114
      ],
      "accounts": [
        {
          "name": "gameState",
          "writable": true
        },
        {
          "name": "playerState",
          "writable": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "gameState",
      "discriminator": [
        144,
        94,
        208,
        172,
        248,
        99,
        134,
        120
      ]
    },
    {
      "name": "mrAiPositionReport",
      "discriminator": [
        119,
        87,
        57,
        110,
        136,
        18,
        197,
        65
      ]
    },
    {
      "name": "playerState",
      "discriminator": [
        56,
        3,
        60,
        86,
        174,
        16,
        244,
        195
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidMove",
      "msg": "Invalid move between locations"
    },
    {
      "code": 6001,
      "name": "notAllowedToPlay",
      "msg": "Not allowed to play"
    }
  ],
  "types": [
    {
      "name": "gameState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "pot",
            "type": "u64"
          },
          {
            "name": "round",
            "type": "u64"
          },
          {
            "name": "startAt",
            "type": "u64"
          },
          {
            "name": "endAt",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "mrAiPositionReport",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "round",
            "type": "u64"
          },
          {
            "name": "clueHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "movesHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "playerState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "location",
            "type": "u8"
          },
          {
            "name": "lastRoundPlayed",
            "type": "u64"
          },
          {
            "name": "potContribution",
            "type": "u64"
          },
          {
            "name": "hasSearched",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
