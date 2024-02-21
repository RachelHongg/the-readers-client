import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Carousel from "./Carousel";
import AddBook from "components/Addbook";
import "./index.css";
import api from "api";
import { Room, Book } from "interface/interface";

import { useToggleDrawer } from "recoil/handler";
import LogInForm from "components/Header/SideDrawer/form/LogInForm";
import { useRecoilState } from "recoil";
import { userState } from "recoil/atom";
import SignUpForm from "components/Header/SideDrawer/form/SignUpForm";

interface RoomResponse {
	data: Room;
}

function RoomLobby() {
	const { roomId } = useParams();
	const navigate = useNavigate();

	const [room, setRoom] = useState<Room>({ Books: [] as Book[] });
	const [roomRefresh, setRoomRefresh] = useState(false);

	useEffect(() => {
		api.get<RoomResponse>(`/rooms/${roomId}`).then((res) => {
			console.log(res.data);
			setRoom(res.data.data);
		});
	}, [roomId, roomRefresh]);

	const bookClickHandler = (book: Book) => {
		navigate(`/room/${roomId}/book/${book.id}`);
	};

	return (
		<>
			<Canvas style={{ width: "100%", height: "100vh", backgroundColor: "black" }}>
				<OrbitControls />

				<directionalLight position={[1, 1, 1]} />
				<Environment background blur={0} files="/room/christmas_photo_studio_07_4k.hdr" />
				<Carousel numPlanes={13} radius={3} books={room.Books} bookClickHandler={bookClickHandler} />
			</Canvas>
			<AddBook className="add-book" room={room} refresher={setRoomRefresh} />
		</>
	);
}

function SetupCamera() {
	const { camera } = useThree();

	useEffect(() => {
		camera.rotation.z = THREE.MathUtils.degToRad(90);
		camera.updateProjectionMatrix();
	}, [camera]);

	return null;
}

export default RoomLobby;
