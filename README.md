# NFT Tickets

El siguiente trabajo práctico consiste en un mercado de compra y venta de tickets en formato NFT para entradas a conciertos.

## Integrantes
- Felipe De Luca
- Ezequiel Vilardo
- Sebastian Bento Inneo Veiga
- Santiago Locatelli
- Ana Gabriela Gutson
- Francisco Pereyra

## Compilación

### Requisitos
- Node.js, v12 or higher
- truffle
- ganache
- Wallet en metamask
- Infura Project

### ¿Cómo conectamos la wallet con la red que usamos?
Entrar a [umbria](https://www.umbria.network/connect/optimistic-ethereum-testnet-goerli) y agregar la red.

### Faucet utilizada
Para agregar dinero a la wallet, ingresar a [link](https://optimismfaucet.xyz/).

### ¿Qué se debe agregar?
- .env en /eth con:
    - `INFURA_KEY="xxx"`
    - `GANACHE_MNEMONIC="{mnemonic de ganache}"`
    - `GOERLI_MNEMONIC="{mnemonic de metamask}"`

- .env.local en /web con:
  - `NEXT_PUBLIC_INFURA_PROJECT_ID="xxx"`
  - `NEXT_PUBLIC_INFURA_API_KEY_SECRET="xxx"`

### ¿Cómo se compila el proy**ecto?

- Primero compilamos los contratos que estan en `/eth`
```
truffle migrate --skip-dry-run --config truffle-config.ovm.js --network optimistic_goerli
```

- Luego generamos los tipos de typescript en `/web`
```
npm run generate-types
```

- Y lanzamos desde `/web` con
```
npm run dev
```

## Proyecto

### Secciones

- Market:
    - Mercado donde comprar tickets.
- Sell New Ticket:
    - Aca podras listar nuevos tickets.
- Tickets Owned:
    - Se pueden visualizar los tickets comprados.
- My Tickets on Market:
    - Tickets publicados por vos para la venta.

## Video demo

[![Watch the video](https://i.imgur.com/Gd7gJNa.png)](https://recordit.co/0u9fh7QmjH)


## Bibliografía

- https://trufflesuite.com/guides/nft-marketplace/