import React, { useEffect, useState } from "react";

import { AppBar, Toolbar, Typography, Container, Box, IconButton, Menu, MenuItem, Button } from "@mui/material";
import HomeIcon from "./HomeIcon";
import SideDrawer from "./SideDrawer";
import Info from "./Info";
import { Link } from "react-router-dom";
import { isMainState } from "recoil/atom";
import { useRecoilState } from "recoil";

export default function Header() {
	const [isHovering, setIsHovering] = useState(false);
	const [anchorElNav, setAnchorElNav] = useState(null);
	const [anchorElUser, setAnchorElUser] = useState(null);
	// recoil
	const [isMain, setIsMain] = useRecoilState(isMainState);

	const appTitle = "The Readers";
	const pages = [];

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	useEffect(() => {
		if (isMain) {
			setIsHovering(true);
		} else {
			setIsHovering(false);
		}
	}, [isMain]);

	return (
		<div
			onMouseOver={() => {
				if (!isMain) setIsHovering(true);
			}}
			onMouseLeave={() => {
				if (!isMain) setIsHovering(false);
			}}
			style={{ height: "25px", position: "absolute", top: 0, width: "100%" }}
		>
			<AppBar
				position="absolute"
				style={{
					top: isHovering ? 0 : `-64px`,
					transition: "top 0.5s",
				}}
			>
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						<HomeIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
						<Typography
							variant="h6"
							noWrap
							component={Link}
							to="/"
							sx={{
								mr: 2,
								display: { xs: "none", md: "flex" },
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							{appTitle}
						</Typography>

						<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
							<IconButton
								size="large"
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleOpenNavMenu}
								color="inherit"
							>
								{/* <MenuIcon /> */}
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorElNav}
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "left",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "left",
								}}
								open={Boolean(anchorElNav)}
								onClose={handleCloseNavMenu}
								sx={{
									display: { xs: "block", md: "none" },
								}}
							>
								{pages.map((page) => (
									<MenuItem key={page} onClick={handleCloseNavMenu}>
										<Typography textAlign="center">{page}</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>
						<HomeIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
						<Typography
							variant="h5"
							noWrap
							component={Link}
							to="/"
							sx={{
								mr: 2,
								display: { xs: "flex", md: "none" },
								flexGrow: 1,
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							{appTitle}
						</Typography>
						<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
							{pages.map((page) => (
								<Button key={page} onClick={handleCloseNavMenu} sx={{ my: 2, color: "white", display: "block" }}>
									{page}
								</Button>
							))}
						</Box>
						<SideDrawer />
					</Toolbar>
				</Container>
			</AppBar>
		</div>
	);
}
