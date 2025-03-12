import { createContext, useContext, useEffect, useState } from "react";
import { nakamaConfig, NODE_API_ENDPOINT } from "@/data/config";
import { WebSocketAdapterPb } from "@heroiclabs/nakama-js-protobuf";
import { CHANNEL_ALL } from "@/data/constants";
import { Client } from "@heroiclabs/nakama-js";
import api from "@/utils/api-handler";
import axios from "axios";
import PropTypes from "prop-types";
const NakamaContext = createContext();
export const nakama = {
  client: null,
  session: null,
  account: null,
};

export const NakamaProvider = ({ children }) => {
  const [client] = useState(
    new Client(
      nakamaConfig.serverKey,
      nakamaConfig.host,
      nakamaConfig.port,
      nakamaConfig.useSSL === "true"
    )
  );
  const [session, setSession] = useState(null);
  const [account, setAccount] = useState(null);
  const [socket, setSocket] = useState(null);
  const [wallet, setWallet] = useState({});
  const logOut = async () => {
    try {
      socket && socket.disconnect();
      if (client && session) {
        await client.sessionLogout(
          session,
          session.token,
          session.refreshToken
        );
      }
    } catch (err) {
      console.error("logout error", err);
    }
    setSession(null);
    setSocket(null);
  };
  const authenticate = async (id) => {
    const onChannelMessage = (channelMessage) =>
      api.emit("channelmessage", channelMessage);
    const onMatchData = (matchData) => api.emit("matchdata", matchData);
    try {
      await logOut();
      let res = await axios({
        method: "post",
        url: `${NODE_API_ENDPOINT}/auth`,
        withCredentials: true,
        data: { user_id: id },
      });
      const user_id = res.data.user_id;

      const newSession = await client.authenticateCustom(user_id, true);
      const account = await client.getAccount(newSession);
      nakama.client = client;
      nakama.session = newSession;
      nakama.account = account;

      const newSocket = client.createSocket(
        nakamaConfig.useSSL === "true",
        false,
        new WebSocketAdapterPb()
      );
      await newSocket.connect(newSession);
      newSocket.onchannelmessage = onChannelMessage;
      newSocket.onmatchdata = onMatchData;

      // Chat
      await newSocket.joinChat(CHANNEL_ALL);

      setAccount(account);
      const wallet = JSON.parse(account.wallet);
      setWallet(wallet);

      setSession(newSession);
      setSocket(newSocket);
      api.emit("version:check");
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };
  const refreshAccount = async () => {
    if (!nakama.session) return;
    const account = await client.getAccount(nakama.session);
    nakama.account = account;
    setAccount(account);
    const wallet = JSON.parse(account.wallet);
    setWallet(wallet);
  };
  useEffect(() => {
    authenticate();
    return () => {
      logOut();
    };
  }, []);

  useEffect(() => {
    // 페이지 가시성 변경 이벤트 리스너
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        authenticate();
      }
      if (document.visibilityState === "hidden") {
        logOut();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 클린업
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [session]);

  return (
    <NakamaContext.Provider
      value={{
        account,
        client,
        session,
        socket,
        wallet,
        refreshAccount,
        authenticate,
        logOut,
      }}
    >
      {children}
    </NakamaContext.Provider>
  );
};

export const useNakama = () => {
  const context = useContext(NakamaContext);
  if (!context) {
    throw new Error("useNakama must be used within a NakamaProvider");
  }
  return context;
};
export default NakamaProvider;

NakamaProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
