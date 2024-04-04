import ChessBoard from "@/components/chess-board/chess-board";
import { Box, Grid, Group } from "@mantine/core";

const HomePage = (): React.ReactElement => {
	return (
		<Box>
			<Grid gutter={0}>
				<Grid.Col span={3}>
					<h1>Chess</h1>
				</Grid.Col>
				<Grid.Col span={6} offset={1}>
					<Group justify="center">
						<ChessBoard />
					</Group>
				</Grid.Col>
				<Grid.Col span={2}>
					<h1>Chess</h1>
				</Grid.Col>
			</Grid>
		</Box>
	);
};

export default HomePage;
