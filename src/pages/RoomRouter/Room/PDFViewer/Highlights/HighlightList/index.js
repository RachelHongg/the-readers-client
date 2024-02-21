import React, { useRef, useEffect, useState } from "react";
import HighlightListItem from "./HighlightListItem";
import { Box, Collapse, ThemeProvider, Typography, useMediaQuery, useTheme } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { Popover, Button } from "@mui/material";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { useRecoilState, useRecoilValue } from "recoil";
import { isAppBarPinnedState, roomUsersState, userState, roomNameState } from "recoil/atom";
import { useParams, useSearchParams } from "react-router-dom";
import { baseURL } from "config/config";
import { user, roomName } from "recoil/atom";
import { useToggleDrawer } from "recoil/handler";

export default function HighlightList({ highlights, deleteHandler }) {
	const listContainer = useRef(null);
	const [items, setItems] = useState([]);
	const [showItems, setShowItems] = useState(true);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [ChevronIcon, setChevronIcon] = useState(isMobile ? ChevronLeft : ChevronDown);
	const [isAppBarPinned, setIsAppBarPinned] = useRecoilState(isAppBarPinnedState);
	const [anchorEl, setAnchorEl] = useState(null);
	const user = useRecoilValue(userState);
	const { roomId } = useParams();
	const [url, setUrl] = useState("");
	const roomUsers = useRecoilValue(roomUsersState);
	const toggleDrawer = useToggleDrawer();
	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;

	useEffect(() => {
		if (isMobile) {
			if (drawerOpen) {
				setShowItems(true);
				setChevronIcon(ChevronRight);
			} else {
				setShowItems(false);
				setChevronIcon(ChevronLeft);
			}
		} else {
			setShowItems(true);
			setChevronIcon(ChevronDown);
		}
	}, [isMobile, drawerOpen]);

	// Drawer 토글 함수
	const toggleHighlightDrawer = () => {
		if (isMobile) {
			setDrawerOpen(!drawerOpen);
			setChevronIcon(drawerOpen ? ChevronRight : ChevronLeft);
			console.log("drawerOpen", drawerOpen);
		} else {
			toggleItemsDisplay();
		}
	};

	// "Highlights" 클릭 시 showItems 상태를 토글하는 함수
	const toggleItemsDisplay = () => {
		setShowItems(!showItems);
		setChevronIcon(showItems ? ChevronDown : ChevronUp);
	};

	useEffect(() => {
		const newHighlights =
			highlights?.map((hl, i) => <HighlightListItem key={i} hlInfo={hl} deleteHandler={() => deleteHandler(hl)} />) ||
			[];
		console.log("new highlights", newHighlights);
		setItems(newHighlights);
	}, [highlights]);

	useEffect(() => {
		// Drawer가 열릴 때 document에 클릭 이벤트 리스너 추가
		if (drawerOpen) {
			document.addEventListener("click", handleOutsideClick);
		} else {
			document.removeEventListener("click", handleOutsideClick);
		}

		// 컴포넌트가 언마운트될 때 document에서 클릭 이벤트 리스너 제거
		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, [drawerOpen]);

	// Drawer 바깥쪽을 클릭했을 때 Drawer를 닫는 함수
	const handleOutsideClick = (event) => {
		if (listContainer.current && !listContainer.current.contains(event.target)) {
			setDrawerOpen(false);
		}
	};
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const copyUrlToClipboard = () => {
		navigator.clipboard
			.writeText(url)
			.then(() => {
				console.log("URL copied to clipboard");
			})
			.catch((error) => {
				console.error("Failed to copy URL to clipboard:", error);
			});
	};

	const CreateUrl = () => {
		if (!user) {
			alert("회원가입1이 필요합니다.");
			toggleDrawer("signin")();
			return;
		}
		const decodeHost = user.nick;
		const newUrl = `${window.location.host}/invite/room/${roomId}/host/${decodeHost}`;
		setUrl(newUrl);
	};

	useEffect(() => {
		CreateUrl();
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<Box
				id="highlights-list"
				ref={listContainer}
				sx={{
					maxWidth: "100%",
					height: "100%",
					overflow: "auto",
					backgroundColor: "#e1c69e",
					padding: "10px",
					boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
					borderRadius: "3px",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					position: "absolute",
					top: "0px",
					right: "0px",
					width: drawerOpen || !isMobile ? "300px" : "50px", // 모바일에서 Drawer가 열릴 때 너비 조정
					transition: "width 0.3s ease-in-out", // 너비 변화에 애니메이션 적용
				}}
			>
				<Typography variant="h6" component="h6">
					하이라이트
				</Typography>

				{isMobile && (
					<ChevronIcon sx={{ top: "10px", right: "10px", cursor: "pointer" }} onClick={toggleHighlightDrawer} />
				)}
				<Collapse in={showItems || drawerOpen}> {items} </Collapse>
				<div>
					<Button
						aria-describedby={id}
						variant="contained"
						onClick={handleClick}
						sx={{
							position: "absolute",
							bottom: "10px",
							right: "10px",
							marginTop: "10px",
							cursor: "pointer",
						}}
					>
						<ShareIcon sx={{ marginTop: "10px", cursor: "pointer" }} />
					</Button>
					<Popover
						id={id}
						open={open}
						anchorEl={anchorEl}
						onClose={handleClose}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "left",
						}}
					>
						<Typography sx={{ p: 2 }}>{url}</Typography>
						<Button onClick={copyUrlToClipboard}>복사하기</Button>
					</Popover>
				</div>
			</Box>
		</ThemeProvider>
	);
}
