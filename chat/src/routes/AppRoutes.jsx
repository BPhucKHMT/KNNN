import React from 'react';
import {Routes ,Route} from 'react-router-dom'
import ChatSuggesterApp from '../components/ChatSuggesterApp';

const AppRoutes = props => {
    return (
        <div>
            <Routes>
            {/* private route */}
            <Route path="/" element={<ChatSuggesterApp />} />
            <Route path="*" element={<h1>404 not found</h1>} />
          </Routes>
        </div>
    );
};

export default AppRoutes;