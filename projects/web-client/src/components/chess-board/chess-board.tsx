import { Chess, type ShortMove, type Move, type Square } from "chess.js";
import { useState } from "react";
import { Chessboard as ReactChessboard } from "react-chessboard";

export default function ChessBoard(): React.ReactElement {
	const [game, setGame] = useState(new Chess());

	function makeAMove(move: string | ShortMove): Move | null {
		const gameCopy = { ...game };
		const result = gameCopy.move(move);
		setGame(gameCopy);
		return result; // null if the move was illegal, the move object if the move was legal
	}

	function makeRandomMove(): void {
		const possibleMoves = game.moves();
		if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
			return; // exit if the game is over
		const randomIndex = Math.floor(Math.random() * possibleMoves.length);
		if (possibleMoves[randomIndex]) {
			makeAMove(possibleMoves[randomIndex]);
		}
	}

	function onDrop(sourceSquare: Square, targetSquare: Square): boolean {
		const move = makeAMove({
			from: sourceSquare,
			to: targetSquare,
			promotion: "q", // always promote to a queen for example simplicity
		});

		// illegal move
		if (move === null) return false;
		setTimeout(makeRandomMove, 200);
		return true;
	}
	return (
		<ReactChessboard
			boardWidth={700}
			position={game.fen()}
			onPieceDrop={onDrop}
		/>
	);
}
