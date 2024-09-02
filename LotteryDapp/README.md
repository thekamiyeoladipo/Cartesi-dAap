# Lottery DApp 🎉

## 🚀 Overview

Welcome to the upgraded Cartesi Lottery DApp! This decentralized application brings the thrill of a lottery to the blockchain, powered by Cartesi Rollups technology.

---

## 🛠️ Tech Stack

- Node.js
- Cartesi Rollups
- viem library for hex conversions

---

## 🏃‍♂️ Quick Start

1. Clone the repo
2. Install dependencies: `npm install`
3. Set up Cartesi Rollups environment
4. Launch the DApp

---

## 🎮 How to Interact(Advanace Requests)

### 🛒 Buy a Ticket

```json
{
  "action": "buy_ticket",
  "address": "0x1234...5678"
}
```

### 🎭 Draw Winner

```json
{
  "action": "draw_winner"
}
```

### 🕵️ Inspect State

- Current Entries: `"entries"`
- Current Lottery ID: `"lottery_id"`

---

## 🚦 Response Codes

- ✅ "accept": Action processed successfully
- ❌ Error messages for invalid actions or processing errors
