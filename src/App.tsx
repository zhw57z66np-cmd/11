import { HashRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ChildProfilePage from './pages/ChildProfilePage'
import KidHome from './pages/KidHome'
import StudyPage from './pages/StudyPage'
import PracticePage from './pages/PracticePage'
import ExamPage from './pages/ExamPage'
import ParentHome from './pages/ParentHome'
import ParentDetail from './pages/ParentDetail'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-child" element={<ChildProfilePage />} />
        <Route path="/edit-child/:childId" element={<ChildProfilePage />} />
        <Route path="/kid" element={<KidHome />} />
        <Route path="/kid/study/:lessonId" element={<StudyPage />} />
        <Route path="/kid/practice/:lessonId" element={<PracticePage />} />
        <Route path="/kid/exam/:unitId" element={<ExamPage />} />
        <Route path="/parent" element={<ParentHome />} />
        <Route path="/parent/detail/:lessonId" element={<ParentDetail />} />
      </Routes>
    </HashRouter>
  )
}

export default App
