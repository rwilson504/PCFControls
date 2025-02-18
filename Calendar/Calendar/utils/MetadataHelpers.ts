import { IInputs } from "../generated/ManifestTypes";

export async function getNavigationPropertyName(
    context: ComponentFramework.Context<IInputs>,
    entityLogicalName: string,
    lookupField: string
): Promise<string> {
    try {
        // Define the request for RetrieveEntity
        const retrieveEntityRequest = {
            EntityFilters: 8, // Retrieve Relationships metadata
            LogicalName: entityLogicalName,
            MetadataId: { guid: "00000000-0000-0000-0000-000000000000" }, // Dummy GUID
            RetrieveAsIfPublished: true, 
            getMetadata: function () {
                return {
                    boundParameter: null,
                    parameterTypes: {
                        EntityFilters: { typeName: "Microsoft.Dynamics.CRM.EntityFilters", structuralProperty: 3, enumProperties: [{name: "Relationships", value: 8}] },
                        LogicalName: { typeName: "Edm.String", structuralProperty: 1 },
                        MetadataId: { typeName: "Edm.Guid", structuralProperty: 1 },
                        RetrieveAsIfPublished: { typeName: "Edm.Boolean", structuralProperty: 1 },
                    },
                    operationType: 1,
                    operationName: "RetrieveEntity"
                };
            }
        };

        // @ts-ignore Execute the Web API request
        const response = await context.webAPI.execute(retrieveEntityRequest);
        const responseBody = await response.json();

        if (!responseBody || !responseBody.EntityMetadata) {
            console.warn(`No metadata found for entity ${entityLogicalName}`);
            return ""; // Return empty string if metadata is missing
        }

        const entityMetadata = responseBody.EntityMetadata;

        // Search the ManyToOneRelationships for the lookup field
        const relationship = entityMetadata.ManyToOneRelationships?.find(
            (rel: any) => rel.ReferencingAttribute === lookupField
        );

        if (!relationship) {
            console.warn(`No relationship found for ${lookupField} on entity ${entityLogicalName}`);
            return ""; // Return empty string if no relationship is found
        }

        return relationship.ReferencingEntityNavigationPropertyName || "";
    } catch (error) {
        console.error("Error retrieving navigation property:", error);
        return ""; // Return empty string on error
    }
}
