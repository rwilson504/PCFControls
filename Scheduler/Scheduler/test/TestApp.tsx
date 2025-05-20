import * as React from "react";
import { IInputs, IOutputs } from "../generated/ManifestTypes";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SchedulerControl from "../components/Scheduler";
import { PcfContextProvider } from "../services/PcfContext";
import { PcfContextService } from "../services/PcfContextService";
import { MockPCFContext } from "../mocks/MockPCFContext";
import { MockPCFParameters } from "../mocks/MockPCFParameters";
import { MockPCFMode } from "../mocks/MockPCFMode";
import { MockPCFDataSet } from "../mocks/MockPCFDataSet";

// Use the new mock context for testing
const mockContext = new MockPCFContext();// as unknown as ComponentFramework.Context<IInputs>;

// Create your mock dataset instance
const mockDataSet = new MockPCFDataSet({
    columns: [
        { name: "fullname", displayName: "Full Name", dataType: "SingleLine.Text", alias: "fullname", order: 0, visualSizeFactor: 1 }
    ],
    records: {
        "1": {
            getFormattedValue: () => "Terry Tester",
            getRecordId: () => "1",
            getValue: () => "Terry Tester",
            getNamedReference: () => ({ id: { guid: "1" }, name: "Terry Tester" })
        }
    },
    sortedRecordIds: ["1"]
});


// Provide all required IInputs properties for the mock
mockContext.parameters = new MockPCFParameters({
    schedulerDataSet: mockDataSet,
    eventFieldName: { raw: "name" },
    eventFieldStart: { raw: "start" },
    eventFieldEnd: { raw: "end" },
    eventColor: { raw: "color" },
    eventId: { raw: "id" },
    resourceField: { raw: "resource" },
    resourceParentField: { raw: "parent" },
    resourceName: { raw: "resourceName" },
    resourceGetAllInModel: { raw: "false" },
    entityType: { raw: "testEntity" },
    schedulerAvailableViews: { raw: "Day,Week,Month" }
});


mockContext.mode = new MockPCFMode({
    contextInfo: {
        entityId: "00000000-0000-0000-0000-000000000001",
        entityTypeName: "testEntity",
        entityRecordName: "My Event",
    }
});

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