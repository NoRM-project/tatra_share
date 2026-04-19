import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./components/pages/HomePage"
import TransactionsListPage from "./components/pages/TransactionsListPage"
import GroupsPage from "./components/pages/GroupsPage"
import NewGroupPage from "./components/pages/NewGroupPage"
import TransactionPage from "./components/pages/TransactionPage"
import GroupTransactionDetailPage from "./components/pages/GroupTransactionDetailPage"
import GroupDetailedPage from "./components/pages/GroupDetailedPage"
import ShareTransactions from "./components/pages/ShareTransactions"
import NewGroupTransactionPage from "./components/pages/GroupTransactionCreatePage.tsx"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/transactionslist" element={<TransactionsListPage/>} />
                <Route path="/groups" element={<GroupsPage/>} />
                <Route path="/newgroup" element={<NewGroupPage/>} />
                <Route path="/transactiondetail" element={<TransactionPage/>} />
                <Route path="/grouptransactiondetail" element={<GroupTransactionDetailPage/>} />
                <Route path="/groups/:groupId" element={<GroupDetailedPage />} />
                <Route path="/groups/:groupId/newtransaction" element={<NewGroupTransactionPage/>} />
                <Route path="/sharetransaction" element={<ShareTransactions/>} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
