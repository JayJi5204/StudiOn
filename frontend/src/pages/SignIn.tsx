import React from 'react';
import SigninFooter from '../components/footer/Consentfooter.component';
import SigninHeader from '../components/header/Signin.component';
import SigninSection from '../components/section/signin.component';


const SigninPage:React.FC = () => {

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <SigninHeader/>
                <SigninSection/>
                <SigninFooter/>
            </div>
        </main>
  );
};

export default SigninPage;