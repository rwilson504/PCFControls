import * as React from "react";
import { IInputs, IOutputs } from "../generated/ManifestTypes";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SchedulerControl from "../components/Scheduler";
import { PcfContextProvider } from "../services/PcfContext";
import { PcfContextService } from "../services/PcfContextService";
import { MockPCFContext } from "../mocks/MockPCFContext";

// Use the new mock context for testing
const mockContext = new MockPCFContext() as unknown as ComponentFramework.Context<IInputs>;

const mockPcfContextService = new PcfContextService({
    context: mockContext,
    instanceid: "test-instance-id",
    height: 600,    
});

const TestApp: React.FC = () => (
    <DndProvider backend={HTML5Backend}>
        <PcfContextProvider pcfcontext={mockPcfContextService}>
                <SchedulerControl />
        </PcfContextProvider>
    </DndProvider>
);

export default TestApp;