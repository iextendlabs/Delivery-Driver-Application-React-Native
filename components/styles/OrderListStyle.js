const OrderListStyle = {
  OrderLinks:{
    flex:1,
    flexDirection:"row",
    alignItems: 'center',
    paddingTop: 12,
    justifyContent: 'center'

  },
  container: {
    flex: 1,
    paddingTop: 10
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderContainer: {
    padding: 10,
    backgroundColor: "#f8f8f8",
    marginBottom: 10  },
  Pending: {
    backgroundColor: '#bfd9ff',
  },
  Accepted: {
    backgroundColor: '#C1E1C1',
  },
  Coming: {
    backgroundColor: '#E1D5E7',
  },
  Traveling: {
    backgroundColor: '#FCE4D6',
  },
  Dropped: {
    backgroundColor: '#fffbcc',
  },
  arrivedPick: {
    backgroundColor: '#D0E8F2',
  },
  pickMe: {
    backgroundColor: '#dfdfdf',
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  status: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: "#888",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderDetails: {
    marginBottom: 15,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 0,
    textAlign: "center",
    color: 'black'
  },
  // New styles for the boxes
  detailBox: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailBoxText: {
    fontSize: 16,
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneNumber: {
    marginLeft: 10,
  },
  shippingAddressBox: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addressLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressLine: {
    fontSize: 16,
    marginRight: 5,
  },
  commentBox: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginVertical: 5,
  },
  commentText: {
    fontSize: 16,
  },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "#24235D",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  noItemsText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  commentContainer: {
    marginTop: 20,
  },
  descriptionContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  amountInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#24235D",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  successMessage: {
    color: "green",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorMessage: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: "#198754",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  completeButton: {
    backgroundColor: "#01AF94",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  rejectButton: {
    backgroundColor: "#C20D20",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    // fontWeight: "bold",
  },
  picker: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  button: {
    backgroundColor: '#0d6efd',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  otherMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  messageBubble: {
    backgroundColor: '#DCF8C6', // You can customize the background color of the message bubble
    padding: 10,
    borderRadius: 10,
  },
  messageText: {
    fontSize: 16,
  },
  messageRole: {
    fontSize: 12,
    color: '#8f9193',
  },
  chatModalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    flex: 1, 
    flexDirection: 'column'
  },
  notificationContainer: {
    padding: 10,
    backgroundColor: "#c6d4f8",
    marginBottom: 10,
    flexDirection: "row",
  },
  icons: {
    marginRight:10,
    marginLeft:10
  }
};

export default OrderListStyle;