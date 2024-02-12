import { Anchor, Box, Flex, Grid, Text, Title } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import classes from './auth-layout.module.scss';

export default function AuthLayout() {
  return (
    <Grid gutter={0}>
      <Grid.Col
        span={{ xs: 12, sm: 12, md: 6, lg: 5, xl: 4 }}
        component={Box}
        className={classes.imageWrapper}
      >
        <Flex justify="center">
          <Box className={classes.titleBox}>
            <Title>ChessMaster-X</Title>
          </Box>
          <Box className={classes.quoteBox}>
            <Title order={1} fw="lighter">
              {' '}
              Where strategy meets destiny...
            </Title>
          </Box>
        </Flex>

        {/* ///credit  */}
        <Box className={classes.imgCredit}>
          <Text>
            Photo by{' '}
            <Anchor href="https://unsplash.com/@nasimkeshmiri?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
              Nasim Keshmiri{' '}
            </Anchor>
            on{' '}
            <Anchor href="https://unsplash.com/photos/brown-and-black-chess-pieces-1POtjtB8mZc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
              Unsplash
            </Anchor>
          </Text>
        </Box>
      </Grid.Col>
      <Grid.Col
        span={{ xs: 12, sm: 12, md: 6, lg: 7, xl: 8 }}
        component={Box}
        className={classes.formWrapper}
      >
        <Outlet />
      </Grid.Col>
    </Grid>
  );
}
//
