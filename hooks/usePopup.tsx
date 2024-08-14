import { useState, useEffect } from "react";

const usePopup = (autoCloseTime = 5000) => {
	const [isOpen, setIsOpen] = useState(false);
	const [message, setMessage] = useState("");
	type PopupType = "success" | "error" | "info";

	const [type, setType] = useState<PopupType>("info");
	const openPopup = () => setIsOpen(true);
	const closePopup = () => setIsOpen(false);

	const newPopup = (message: string, type: PopupType) => {
		setMessage(message);
		setType(type);
		openPopup();
	};

	useEffect(() => {
		if (isOpen) {
			const timer = setTimeout(() => {
				closePopup();
			}, autoCloseTime);

			return () => clearTimeout(timer);
		}
	}, [isOpen, autoCloseTime]);

	return {
		isOpen,
		openPopup,
		closePopup,
		message,
		setMessage,
		type,
		setType,
		newPopup,
	};
};

export default usePopup;
