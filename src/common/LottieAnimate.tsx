import React from 'react';
import Lottie from 'react-lottie';
import signUpAnimate from '../assets/lottieFiles/signup.json';

const AnimationComponent: React.FC = () => {
    // Define default options for the Lottie animation
    const defaultOptions = {
        loop: true,
        autoplay: true, // Make the animation play automatically
        animationData: signUpAnimate,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className="flex justify-center items-center">
            <Lottie options={defaultOptions} height={400} width={400} />
        </div>
    );
};

export default AnimationComponent;
