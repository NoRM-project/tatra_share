import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./components/pages/HomePage"
import TransactionsListPage from "./components/pages/TransactionsListPage"
import GroupsPage from "./components/pages/GroupsPage"
import NewGroupPage from "./components/pages/NewGroupPage"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/transactionslist" element={<TransactionsListPage/>} />
                <Route path="/groups" element={<GroupsPage/>} />
                <Route path="/newgroup" element={<NewGroupPage/>} />
                <Route path="/" element={<NewGroupPage/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
