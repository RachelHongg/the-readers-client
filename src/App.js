import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "pages/Main";
import RoomRouter from "./pages/RoomRouter";
import Invite from "pages/Invite";
import Header from "components/Header";
import { Box } from "@mui/material";
import BookCarousel from "components/BookCarousel";
import IconButton from "@mui/material/IconButton";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import "./global.css";
import { useRecoilState } from "recoil";
import { isAppBarPinnedState } from "recoil/atom";

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {
	const [mode, setMode] = React.useState("light");
	const [isAppBarPinned, setIsAppBarPinned] = useRecoilState(isAppBarPinnedState);
	const colorMode = React.useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
			},
		}),
		[]
	);

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode,
					primary: {
						// global.css에서 정의한 변수를 사용합니다. --color-primary-0
						main: "#d0a970",
						light: "#e1c69e",
						dark: "#b8863c",
						contrastText: "#fff",
					},
					secondary: {
						main: "#e1c69e",
					},
				},
				typography: {
					fontFamily: '"Noto Sans KR", "Helvetica", "Arial", sans-serif', // 여기에 원하는 폰트 패밀리를 설정
					fontSize: 16, // 기본 폰트 사이즈 설정
					h1: {
						fontSize: "2.5rem", // 개별 타이틀 크기 조정
					},
				},
				components: {
					// Menu에 대한 스타일 오버라이드
					MuiMenu: {
						styleOverrides: {
							// Menu의 기본 커서 스타일을 auto로 설정
							list: {
								cursor: "auto",
							},
						},
					},
					// MenuItem에 대한 스타일 오버라이드 (선택적)
					MuiMenuItem: {
						styleOverrides: {
							root: {
								// MenuItem 내부의 커서 스타일을 auto로 설정
								cursor: "auto",
							},
						},
					},
					MuiInput: {
						styleOverrides: {
							root: {
								"&:focus": {
									backgroundColor: "#f5e6cf", // 입력 필드에 포커스 됐을 때의 배경색
								},
							},
						},
					},
					MuiInputLabel: {
						styleOverrides: {
							root: {
								"&.Mui-focused": {
									color: " #f5e6cf", // 라벨 포커스 시 색상 변경
								},
							},
						},
					},
				},
			}),
		[mode]
	);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<Box
					sx={{
						height: "100vh",
					}}
				>
					<Router>
						{isAppBarPinned && <Box sx={{ height: isAppBarPinned ? "64px" : "0", width: "100%" }}></Box>}
						<Header>
							{theme.palette.mode} mode
							<IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
								{theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
							</IconButton>
						</Header>

						<Routes>
							<Route path="/" element={<Main />} />
							<Route path="/room/:roomId/*" element={<RoomRouter />} />
							<Route path="/invite/room/:roomId/host/:host" element={<Invite />} />
						</Routes>
					</Router>
				</Box>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

export default App;
