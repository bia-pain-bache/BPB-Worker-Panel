# :material-cog-outline:{ .md .middle } Warp Pro settings

This section applies exclusively to the **Warp Pro** subscription, as detailed [here](../usage/warp-pro.md).  

![Warp Pro settings](../images/warp-pro-settings.jpg)

## Definitions

Several common terms are used across all implementations of Warp noise (fake packets). Most cores, including **Xray**, **Xray Knocker**, and **Amnezia**, share at least two parameters:

### Mode

Each Warp noise implementation has a specific mode that determines in which shape noise is sent to the server to obfuscate the connection.

### Count

The number of noise packets sent by the client to the server.

### Size

The size of each noise packet, measured in bytes.

### Delay

The interval between sending noise packets.

## MahsaNG

### MahsaNG Mode

- **none**: No noise is applied, equivalent to a standard Warp config.
- **quic**: Recommended by developers for conditions in Iran.
- **random**: Generates noise randomly.
- Custom mode: Allows use of a custom HEX string (e.g., `fe09ad5600bc...`).

## Clash and Amnezia

This section applies to **Amnezia**, **WG Tunnel**, and **Clash-Mihomo** core clients, which share the same settings. You specify the number of noise packets and their minimum and maximum sizes. In the **Warp Pro** subscription table, you can also download a zip file for **Amnezia** and **WG Tunnel** configs, in addition to the subscriptions.

These settings are determined experimentally for each ISP through trial and error.

## v2rayNG and v2rayN

### v2ray Modes

Four modes are available for **v2rayNG** and **v2rayN** clients: **base64**, **string**, **hex**, and **random**. In the Noise Count section, you can specify how many noise packets to include in the config. Multiple noises with different types can be added; they do not need to be uniform.

### Noise Packet

The packet value must correspond to the selected mode:  

- **Base64**: Requires a valid Base64 value.
- **String**: Can be any string.
- **Random**: Specify the string length.
- **Hex**: Requires a Hex string.

Example:

```title="Base64"
NTUyMjU0NjItN2I4MC00YWFmLWE3NDgtNjZiYWZiNjlmNmQ2
```

```title="String"
salamchetori123
```

```title="Random"
10-30
```

```title="Hex"
01d800f9373b2c418713aafde43021004ac3b89f
```

!!! tip
    - Convert text to Base64 using [this tool](https://onlinebase64tools.com/base64-encode).
    - Generate a Hex string with [this tool](https://onlinetools.com/random/generate-random-hexadecimal-numbers).
