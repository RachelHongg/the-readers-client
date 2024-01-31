import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "./Sidebar";
import Room from "./Room";
import ClientRoom from "./ClientRoom";
import JoinCreateRoom from "./JoinCreateRoom";
import socket from "socket.js";
import { useParams } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

// 무작위 uuid 값 만들기. GPT에서 crypto 함수를 추천했음.
const uuid = () => {
	var S4 = () => {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
};
/* GPT 코드
 * const crypto = require('crypto');
 * const uuid = crypto.randomUUID();
 * console.log(uuid);
 **/

const DrawingCanvas = () => {
	const [userNo, setUserNo] = useState(0);
	const [roomJoined, setRoomJoined] = useState(false);
	const [user, setUser] = useState({});
	const [users, setUsers] = useState([]);
	const { roomId, bookId } = useParams();

	useEffect(() => {
		setRoomJoined(true);

		setUser({
			roomId: roomId,
			bookId: bookId,
			userId: uuid(),
			userName: "host",
			host: true,
			presenter: true,
		});
	}, []);

	useEffect(() => {
		if (roomJoined) {
			socket.emit("user-joined", user);
		}
	}, [roomJoined]);

	useEffect(() => {
		socket.on("users", (data) => {
			// 각 사용자의 userId와 bookId를 조합하여 canvasId를 생성
			const updatedUsers = data.map((user) => ({
				...user,
				canvasId: `${user.userId}`, // userId와 bookId를 결합하여 canvasId 생성
			}));
			setUsers(updatedUsers); // 상태 업데이트
			setUserNo(updatedUsers.length);
		});
	}, []);

	return (
		<div className="home">
			{/* <ToastContainer /> */}
			<>
				<Sidebar users={users} user={user} />
				<UtilButton />
				{users.map((user, index) => (
					<ClientRoom key={index} canvasId={user.canvasId} setUsers={setUsers} setUserNo={setUserNo} />
				))}
			</>
		</div>
	);
};

const UtilButton = () => {
	return (
		<>
			<div className="row justify-content-center align-items-center text-center py-2">
				<div className="col-md-2">
					<div className="color-picker d-flex align-items-center justify-content-center">
						<input
							type="button"
							// 노란색 버튼
							className="btn btn-warning"
							value="load canvas #time (미구현)"
							// onClick={loadCanvas}
						/>
					</div>
				</div>
			</div>
			<div className="row justify-content-center align-items-center text-center py-2">
				<div className="col-md-1">
					<div className="color-picker d-flex align-items-center justify-content-center">
						<input
							type="button"
							// 초록색 버튼
							className="btn btn-success"
							value="save canvas"
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default DrawingCanvas;
