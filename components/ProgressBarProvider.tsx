'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <ProgressBar
                height="4px"
                color="#22c55e" // This is a green color to match your theme
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    );
};

export default ProgressBarProvider;