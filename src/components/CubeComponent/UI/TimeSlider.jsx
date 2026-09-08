import useCubeBreak from "@/store/cubeBreak"
import { Slider } from "antd"

const TimeSlider = () => {
    const setProgress = useCubeBreak((state) => state.setProgress)
    const currentProgress = useCubeBreak((state) => state.currentProgress)

    const handleChange = (value) => {
        console.log(value);
        setProgress(value)
    }
    return <div className="timeSlider">
        <Slider
            className="sliderCube"
            value={currentProgress}
            max={1}
            tooltip={{ open: false }}
            onChange={handleChange}
            step={0.01}
        />
    </div>
}

export default TimeSlider