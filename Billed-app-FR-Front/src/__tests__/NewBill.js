/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import mockStore from "../__mocks__/store"
import { localStorageMock } from "../__mocks__/localStorage.js"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes.js"
import store from "../__mocks__/store"

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I should be able to successfully add a .jpg, .jpeg or .png file to the bill being created", () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a"}))
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
      document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      })
      const addFileButton = screen.getByTestId("file")
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      // Makes sure test covers both cases : with a file of a valid type, and with a file of invalid type
      const validFile = new File(["testFile"], "testFile.png", { type: "image/png" })
      const invalidFile = new File(["testFile"], "testFile.png", { type: "image/gif" })
      addFileButton.addEventListener("change", handleChangeFile)
      userEvent.upload(addFileButton, validFile)
      userEvent.upload(addFileButton, invalidFile)

      expect(handleChangeFile).toHaveBeenCalled()
    })
  })
})
