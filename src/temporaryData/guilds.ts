// TODO, these are just temporary types

type Guild = {
  id: number,
  name: string,
  urlName: string,
  rules: Rule[],
  members: number
}

type Rule = {
  text: string,
  color: string
}

const guilds: Guild[] = [
  {
    id: 1,
    name: "My first test guild",
    urlName: "my-first-test-guild",
    rules: [
      {
        text: "Hold at least 1000 AGOTEST",
        color: "#4ade80"
      }
    ],
    members: 128
  },
  {
    id: 2,
    name: "WAGMI Guild",
    urlName: "wagmi-guild",
    rules: [
      {
        text: "Own a CryptoPunk with Lucurious Band",
        color: "#4ade80"
      },
      {
        text: "Own the ETHCC[4] POAP",
        color: "#60a5fa"
      },
      {
        text: "Hold at least 1000 AGLD",
        color: "#818CF8"
      }
    ],
    members: 362
  }
];

export type { Guild };
export { guilds };

