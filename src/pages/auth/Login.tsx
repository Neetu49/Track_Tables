import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { mockUsers } from '../../data/mockData';
import { User, Lock, UserRound, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGN IN'>('LOGIN');
  const [shake, setShake] = useState(false);
  
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    const user = useAuthStore.getState().user;
    if (user?.role === 'Owner/Admin' || user?.role === 'Manager') {
      navigate('/admin');
    } else if (user?.role === 'Kitchen Staff' || user?.role === 'Bar Staff') {
      navigate('/kds');
    } else {
      navigate('/pos');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setError('');
    const success = await login(email);
    
    if (success) {
      handleAuthSuccess();
    } else {
      setError('Invalid credentials. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500); // Reset shake state
    }
  };

  const handleQuickLogin = async (quickEmail: string) => {
    if (isLoading) return;
    setEmail(quickEmail);
    
    setError('');
    const success = await login(quickEmail);
    if (success) {
      handleAuthSuccess();
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh', 
      width: '100vw', 
      backgroundColor: '#57183e', // Dark maroon background
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      
      {/* Main Login Card with framer-motion shake wrapper */}
      <motion.div 
        animate={shake ? { x: [-15, 15, -15, 15, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        style={{
          display: 'flex',
          width: '800px',
          maxWidth: '90%',
          height: '500px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        
        {/* Left Panel - Geometric Shapes */}
        <div style={{
          width: '35%',
          backgroundColor: '#c17a9e',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Geometric overlays */}
          <div style={{
            position: 'absolute',
            top: '-20%', left: '-50%', width: '150%', height: '80%',
            backgroundColor: '#a3507b',
            transform: 'rotate(-35deg)',
            boxShadow: '5px 5px 15px rgba(0,0,0,0.2)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30%', left: '-20%', width: '150%', height: '80%',
            backgroundColor: '#a3507b',
            transform: 'rotate(-35deg)',
            boxShadow: '0 -5px 15px rgba(0,0,0,0.2)'
          }} />

          {/* Tabs */}
          <div style={{
            position: 'absolute',
            right: 0,
            top: '40%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '2rem'
          }}>
            {/* LOGIN Tab */}
            <div 
              onClick={() => !isLoading && setActiveTab('LOGIN')}
              style={{
                backgroundColor: activeTab === 'LOGIN' ? 'white' : 'transparent',
                padding: '12px 30px',
                borderTopLeftRadius: '25px',
                borderBottomLeftRadius: '25px',
                fontWeight: 'bold',
                color: activeTab === 'LOGIN' ? 'black' : 'rgba(255,255,255,0.7)',
                boxShadow: activeTab === 'LOGIN' ? '-5px 5px 10px rgba(0,0,0,0.1)' : 'none',
                letterSpacing: '1px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}>
              LOGIN
            </div>
            {/* SIGN IN Tab */}
            <div 
              onClick={() => !isLoading && setActiveTab('SIGN IN')}
              style={{
                backgroundColor: activeTab === 'SIGN IN' ? 'white' : 'transparent',
                padding: '12px 30px',
                borderTopLeftRadius: '25px',
                borderBottomLeftRadius: '25px',
                fontWeight: 'bold',
                color: activeTab === 'SIGN IN' ? 'black' : 'rgba(255,255,255,0.7)',
                boxShadow: activeTab === 'SIGN IN' ? '-5px 5px 10px rgba(0,0,0,0.1)' : 'none',
                letterSpacing: '1px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}>
              SIGN IN
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div style={{
          width: '65%',
          backgroundColor: 'white',
          padding: '40px 60px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          
          {/* Avatar Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '80px', height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a3507b, #57183e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 20px rgba(87, 24, 62, 0.3)',
              marginBottom: '15px'
            }}>
              <UserRound size={40} color="white" strokeWidth={1.5} />
            </div>
            <h2 style={{ color: '#7a2b53', letterSpacing: '2px', fontWeight: 'bold', margin: 0 }}>{activeTab}</h2>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
            
            {error && <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

            {/* Animated Name Field for Sign In */}
            <div style={{ 
              maxHeight: activeTab === 'SIGN IN' ? '100px' : '0px',
              opacity: activeTab === 'SIGN IN' ? 1 : 0,
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: activeTab === 'SIGN IN' ? 'translateY(0)' : 'translateY(-10px)'
            }}>
              <motion.div 
                whileFocus="focus"
                initial="rest"
                variants={{ rest: { borderBottomColor: '#e0e0e0' }, focus: { borderBottomColor: '#b85e8a' } }}
                style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid', paddingBottom: '8px', marginTop: activeTab === 'SIGN IN' ? '0' : '0' }}>
                <UserRound size={20} color="#9e9e9e" style={{ marginRight: '15px' }} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={isLoading}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '16px',
                    color: '#333',
                    background: 'transparent'
                  }}
                />
              </motion.div>
            </div>

            {/* Email Field */}
            <motion.div 
                whileFocus="focus"
                initial="rest"
                variants={{ rest: { borderBottomColor: '#e0e0e0' }, focus: { borderBottomColor: '#b85e8a' } }}
                style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid', paddingBottom: '8px' }}>
              <User size={20} color="#9e9e9e" style={{ marginRight: '15px' }} />
              <input 
                type="text" 
                placeholder="Email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '16px',
                  color: '#333',
                  background: 'transparent'
                }}
              />
            </motion.div>

            {/* Password Field */}
            <motion.div 
                whileFocus="focus"
                initial="rest"
                variants={{ rest: { borderBottomColor: '#e0e0e0' }, focus: { borderBottomColor: '#b85e8a' } }}
                style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid', paddingBottom: '8px' }}>
              <Lock size={20} color="#9e9e9e" style={{ marginRight: '15px' }} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '16px',
                  color: '#333',
                  background: 'transparent'
                }}
              />
            </motion.div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <a href="#" style={{ color: '#a3507b', fontSize: '13px', textDecoration: 'none', fontWeight: '500', opacity: activeTab === 'LOGIN' ? 1 : 0, pointerEvents: activeTab === 'LOGIN' ? 'auto' : 'none' }}>Forgot Password?</a>
              <motion.button 
                type="submit" 
                disabled={isLoading}
                whileTap={{ scale: 0.95 }}
                style={{
                  backgroundColor: isLoading ? '#9e9e9e' : '#b85e8a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '10px 40px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: isLoading ? 'none' : '0 5px 15px rgba(184, 94, 138, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: '130px',
                  justifyContent: 'center',
                  transition: 'background-color 0.3s'
                }}>
                {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}><Loader2 size={16} /></motion.div> : activeTab}
              </motion.button>
            </div>
          </form>

          {/* Footer Socials */}
          <div style={{ 
            borderTop: '1px solid #f0f0f0', 
            paddingTop: '20px',
            marginTop: 'auto',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <span style={{ fontSize: '13px', color: '#333', fontWeight: 'bold' }}>Or Login With</span>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', opacity: isLoading ? 0.5 : 1 }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'conic-gradient(#ea4335 0 90deg, #34a853 90deg 180deg, #fbbc05 180deg 270deg, #4285f4 270deg 360deg)' }} />
                <span style={{ fontSize: '13px', color: '#333', fontWeight: 'bold' }}>Google</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', opacity: isLoading ? 0.5 : 1 }}>
                <div style={{ width: '18px', height: '18px', backgroundColor: '#1877f2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px', fontSize: '14px', fontWeight: 'bold' }}>f</div>
                <span style={{ fontSize: '13px', color: '#333', fontWeight: 'bold' }}>Facebook</span>
              </div>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Demo Quick Login Buttons */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '15px', fontSize: '14px', letterSpacing: '1px' }}>DEMO QUICK LOGIN</p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {mockUsers.map(u => (
            <button 
              key={u.id} 
              disabled={isLoading}
              onClick={() => handleQuickLogin(u.email)}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                borderRadius: '20px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              {u.name.split(' ')[0]} ({u.role})
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Login;
