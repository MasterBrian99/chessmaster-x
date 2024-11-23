import {
	Paper,
	Title,
	TextInput,
	Button,
	Container,
	Group,
	Anchor,
	Box,
} from "@mantine/core";
import classes from "./sign-page.module.css";
const SignPage = (): React.ReactElement => {
	return (
		<Box
			style={{
				minHeight: "100vh",
				maxHeight: "100%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				width: "100%",
			}}
		>
			<Container size={460}>
				<Title className={classes["title"]} ta="center">
					Sign in by clicking a link in the email
				</Title>

				<Paper withBorder shadow="md" p={30} radius="md" mt="xl">
					<TextInput label="Email" placeholder="me@helios.dev" required />
					<Group
						justify="space-between"
						mt="lg"
						className={classes["controls"]}
					>
						<Anchor
							c="dimmed"
							size="sm"
							className={classes["control"]}
						></Anchor>
						<Button className={classes["control"]}>
							EMAIL ME SIGN IN LINK
						</Button>
					</Group>
				</Paper>
			</Container>
		</Box>
	);
};

export default SignPage;
