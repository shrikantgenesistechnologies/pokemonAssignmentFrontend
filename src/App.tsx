import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';
import { useAppDispatch, useAppSelector } from './store/hooks';
import CustomAlert from './components/Alert';
import { useEffect } from 'react';
import { reset } from './features/slices/auth-slice';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const dispatch = useAppDispatch();
  const { error, message } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(reset());
    }, 3000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, error]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
      <div className="alert-box">
        {error && message && <CustomAlert message={message} severity="error" open={error} />}
      </div>
    </>
  );
}

export default App;
