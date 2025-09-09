# :material-cog-outline:{ .md .middle } Warp Pro 设置

本节仅适用于 **Warp Pro** 订阅，详情请参阅[此处](../usage/warp-pro.md)。

![Warp Pro settings](../images/warp-pro-settings.jpg)

## 定义

在所有 Warp 噪音（伪造数据包）的实现中，有几个常用术语。大多数核心，包括 **Xray**、**Hiddify**、**Xray Knocker** 和 **Amnezia**，至少共享两个参数：

### 模式

每个 Warp 噪音实现都有一个特定的模式，该模式决定了噪音以何种形式发送到服务器以混淆连接。

### 数量

客户端发送到服务器的噪音数据包数量。

### 大小

每个噪音数据包的大小，以字节为单位。

### 延迟

发送噪音数据包之间的时间间隔。

## MahsaNG 和 Hiddify

### Hiddify 模式

-   模式 `m1` 到 `m6`
-   模式 `h_HEX`，其中 HEX 是介于 `00` 和 `FF` 之间的值（例如，`h_0a`、`h_f9`、`h_9c`）
-   模式 `g_HEX_HEX_HEX`，其中 HEX 遵循相同的格式（例如，`g_0a_ff_9c`）

### MahsaNG 模式

-   **none**：不应用噪音，相当于标准的 Warp 配置。
-   **quic**：开发者推荐用于伊朗的条件。
-   **random**：随机生成噪音。
-   自定义模式：允许使用自定义的 HEX 字符串（例如，`fe09ad5600bc...`）。

## Clash 和 Amnezia

本节适用于 **Amnezia**、**WG Tunnel** 和 **Clash-Mihomo** 核心客户端，它们共享相同的设置。您需要指定噪音数据包的数量及其最小和最大大小。在 **Warp Pro** 订阅表中，除了订阅之外，您还可以下载 **Amnezia** 和 **WG Tunnel** 配置的 zip 文件。

这些设置是通过对每个 ISP 进行反复试验来凭经验确定的。

## v2rayNG 和 v2rayN

### v2ray 模式

**v2rayNG** 和 **v2rayN** 客户端有四种模式可用：**base64**、**string**、**hex** 和 **random**。在“噪音数量”部分，您可以指定要在配置中包含多少个噪音数据包。可以添加具有不同类型的多个噪音；它们不必是统一的。

### 噪音数据包

数据包的值必须与所选模式相对应：

-   **Base64**：需要一个有效的 Base64 值。
-   **String**：可以是任何字符串。
-   **Random**：指定字符串长度。
-   **Hex**：需要一个十六进制字符串。

示例：

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
    -   使用[此工具](https://onlinebase64tools.com/base64-encode)将文本转换为 Base64。
    -   使用[此工具](https://onlinetools.com/random/generate-random-hexadecimal-numbers)生成十六进制字符串。