const UpdateCardsImages = (images) => {
	return {
		type: 'CardImagesUpdated',
		payload: images
	}
}

export default UpdateCardsImages;