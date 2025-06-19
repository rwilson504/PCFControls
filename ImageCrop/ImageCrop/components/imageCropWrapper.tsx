import * as React from "react";
import ReactCrop from "react-image-crop";

/**
 * Wrapper for ReactCrop that overrides getBox to account for scaling.
 */
const CropWrapper = (props: React.ComponentProps<typeof ReactCrop>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cropRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (cropRef.current && typeof cropRef.current.getBox === "function") {
            const originalGetBox = cropRef.current.getBox.bind(cropRef.current);

            cropRef.current.getBox = () => {
                const box = originalGetBox();
                const el = cropRef.current.mediaRef?.current;
                if (!el) return box;

                const rect = el.getBoundingClientRect();
                const scaleX = el.clientWidth / rect.width;
                const scaleY = el.clientHeight / rect.height;

                return {
                    x: box.x,
                    y: box.y,
                    width: rect.width * scaleX,
                    height: rect.height * scaleY,
                };
            };
        }
    }, []);

    return (
        <ReactCrop
            ref={cropRef}
            {...props}
        />
    );
};

export default CropWrapper;
