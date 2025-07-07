import styled from "@emotion/styled";
import balances from "../data/balances.json";
import currencies from "../data/currencies.json";
import liveRates from "../data/liveRates.json";
import logo from "../assets/logo.png";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Decimal from "decimal.js";
import { withThousandthPlace } from "../utils/numberFormat";

const CurrencyRow = styled(Box)`
  background-color: white;
  border-radius: 8px;
  margin: 8px 12px 8px 12px;
  padding: 4px;
  padding-right: 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 72px;
`;

const Container = styled(Box)`
  justify-content: center;
  align-items: center;
  display: flex;
  width: 100vw;
`;
const Dashboard = styled(Box)`
  background-color: #f2f9fe;
  width: 400px;
`;

function DashboardPage() {
  const fiat = "USD";
  const fiatSign = "$";
  const currencyRowData = React.useMemo(() => {
    return currencies.currencies.map((currency) => {
      const foundRate = liveRates.tiers.find((rate) => {
        return (
          rate.from_currency === currency.symbol && rate.to_currency === fiat
        );
      });
      const foundBalance = balances.wallet.find((wallet) => {
        return wallet.currency === currency.symbol;
      });
      const tokenAmount = foundBalance?.amount.toString();
      const tokenPriceInFiat = foundRate?.rates?.[0];
      return {
        symbol: currency.symbol,
        logo: logo,
        name: currency.name,
        amount: tokenAmount ? tokenAmount + " " + currency.symbol : "--",
        amountInFiat:
          tokenPriceInFiat && tokenAmount
            ? fiatSign +
              withThousandthPlace(
                new Decimal(tokenAmount).mul(tokenPriceInFiat.rate).toFixed(2)
              )
            : "--",
        amountInFiatRaw:
          tokenPriceInFiat && tokenAmount
            ? new Decimal(tokenAmount).mul(tokenPriceInFiat.rate).toString()
            : "0",
      };
    });
  }, [currencies, liveRates, balances]);

  const totalInFiat = React.useMemo(() => {
    const total = currencyRowData
      .reduce((total, data) => {
        return total.add(new Decimal(data.amountInFiatRaw));
      }, new Decimal(0))
      .toFixed(2);
    return withThousandthPlace(total);
  }, [currencyRowData]);

  return (
    <Container>
      <Dashboard>
        <Box
          display={"flex"}
          alignItems={"center"}
          margin={"12px"}
          justifyContent={"center"}
        >
          <Typography fontSize={"24px"} color="gray" fontWeight={"bold"}>
            {fiatSign}
          </Typography>
          <Typography
            mx={"8px"}
            fontSize={"24px"}
            color="black"
            fontWeight={"bold"}
          >
            {totalInFiat}
          </Typography>
          <Typography fontSize={"24px"} color="gray" fontWeight={"bold"}>
            {fiat}
          </Typography>
        </Box>
        {currencyRowData.map((data) => (
          <CurrencyRow key={data.symbol}>
            <Box display={"flex"} alignItems={"center"}>
              <Box width={"64px"} component={"img"} src={data.logo} />
              <Typography color="black">{data.name}</Typography>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"center"}
              flexDirection={"column"}
              height={"100%"}
            >
              <Typography textAlign={"right"} color="black">
                {data.amount}
              </Typography>
              <Typography fontSize={"13px"} textAlign={"right"} color="gray">
                {data.amountInFiat}
              </Typography>
            </Box>
          </CurrencyRow>
        ))}
      </Dashboard>
    </Container>
  );
}

export default DashboardPage;
