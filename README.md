# Simple Tic Tac Toe

## Installation

Clone this repository (I have included example `.env` files in the repository for easy setup)

## Run

- Run `docker-compose up`
- Wait for the `***** BACKEND READY *****` and the `ready - started server on 0.0.0.0:3000, url: http://localhost:3000` logs. It should take a few minutes.
- Open a few tabs/pages at `http://localhost:3000` to start playing

## Features

- Online room system for multiplayer
  - Players can join a room to face off other players.
  - Users can join a room to watch other people play.
  - The room is closed when one player leaves.
  - Players can see who is watching
- Game logic improvements
  - Game logic is abstracted, win condition is determined algorithmically
    - See `backend/src/utils/game.ts => checkPlayerWin`
  - Trigger end game on draw
    - See `backend/src/utils/game.ts => checkDraw`
- Other improvements
  - Scores are tallied by player name rather than O or X.
  - Alternating first player: Players take turns to start first to balance their chances of winning.
  - Players have to finish a game before starting a new game -- this prevents players from starting a new game when their opponent is about to win.

## Future Improvements

Some areas for improvement in the future:

### Flow Improvements

- To require confirmation from both players before starting a new game

### Style/UX Improvements

- To make it responsive
- To make proper button components with customisable size and type (primary, secondary, etc.) with hover and click effects
- To make the strikeout effect on win
- To improve keyboard navigation on forms (enter to submit, tab indices)
- Improve colour scheme

### System improvements

- Some functions may be missing input validation
- To remove the unused images created by Docker every build

### Performance Improvements

- To remove logs

### Bugs

- Occasionally, when you start a new game after a previous game, you will be unable to make a move. This is intermittent and I haven't identified the source of the bug.
