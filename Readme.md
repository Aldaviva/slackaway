slackaway
============

Set your [Slack](https://slack.com/) presence to away if and only if you're using your computer.

By default, this program will mark you away if you either 

* don't touch your keyboard and mouse for 30 minutes, or
* lock your computer.

This is useful because the Slack webapp will automatically set you away if you don't interact with the Slack tab, even if you're using other programs on your computer. One of my coworkers got in trouble because of this! Her boss thought she was loafing just because Slack showed her as Away, even though she was in fact using her computer and doing her job.

An alternative might be to use the [Slack desktop app](https://slack.com/downloads), but who has the RAM for another 15 Chromium processes?

## Requirements

- [Node.js and NPM](https://nodejs.org/en/)

## Installation
```bash
npm install slackaway
cd node_modules/slackaway
cp config.example.json config.json
$EDITOR config.json # See Configuration below
node index.js
```

## Configuration

1. Go to Slack's [Tokens for Testing and Development](https://api.slack.com/docs/oauth-test-tokens).
2. Copy your token (it starts with `xoxp-`).
3. Paste your token into `config.json` as the value of `slack.authToken`.
4. Optionally change how long (in milliseconds) after you stop using your keyboard and mouse for you to be marked away (`awayStatus.idleTimeBeforeAway`).
5. Optionally change how often (in milliseconds) to check if you've stopped using your keyboard and mouse (`awayStatus.idleTimePollInterval`).
