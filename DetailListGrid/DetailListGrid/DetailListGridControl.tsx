import * as React from 'react';
import {IInputs} from "./generated/ManifestTypes";
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { ShimmeredDetailsList } from 'office-ui-fabric-react/lib/ShimmeredDetailsList';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { IRenderFunction, SelectionMode } from 'office-ui-fabric-react/lib/Utilities';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn, ConstrainMode, IDetailsFooterProps, IDetailsHeaderProps } from 'office-ui-fabric-react/lib/DetailsList';
import { TooltipHost, ITooltipHostProps } from 'office-ui-fabric-react/lib/Tooltip';
import { initializeIcons } from '@uifabric/icons';
import * as lcid from 'lcid';
import { Stack } from 'office-ui-fabric-react';

export interface IProps {
    pcfContext: ComponentFramework.Context<IInputs>,
    isModelApp: boolean,
    dataSetVersion: number
}

interface IColumnWidth {
    name: string,
    width: number
}

//Initialize the icons otherwise they will not display in a Canvas app.
//They will display in Model app because Microsoft initializes them in their controls.
initializeIcons();

export const DetailListGridControl: React.FC<IProps> = (props) => {                           
        
    // using react hooks to create functional which will allow us to set these values in our code
    // eg. when we calculate the columns we can then udpate the state of them using setColums([our new columns]);
    // we have passed in an empty array as the default.
    // const [columns, setColumns] = React.useState(_getColumns);
    // const [items, setItems] = React.useState(_getItems);
    const [columns, setColumns] = React.useState(getColumns(props.pcfContext));
    const [items, setItems] = React.useState(getItems(columns, props.pcfContext));
    const [isDataLoaded, setIsDataLoaded] = React.useState(props.isModelApp);
    // react hook to store the number of selected items in the grid which will be displayed in the grid footer.
    const [selectedItemCount, setSelectedItemCount] = React.useState(0);    
    
    // Set the isDataLoaded state based upon the paging totalRecordCount
    React.useEffect(() => {
        var dataSet = props.pcfContext.parameters.sampleDataSet;
        if (dataSet.loading || props.isModelApp) return;
        setIsDataLoaded(dataSet.paging.totalResultCount !== -1);            
    },
    [items]);

    // When the component is updated this will determine if the sampleDataSet has changed.  
    // If it has we will go get the udpated items.
    React.useEffect(() => {
        //console.log('TSX: props.dataSetVersion was updated');        
        setItems(getItems(columns, props.pcfContext));
        }, [props.dataSetVersion]);  
    
    // When the component is updated this will determine if the width of the control has changed.
    // If so the column widths will be adjusted.
    React.useEffect(() => {
        //console.log('width was updated');
        setColumns(updateColumnWidths(columns, props.pcfContext));
        }, [props.pcfContext.mode.allocatedWidth]);        
    
    // the selector used by the DetailList
    const _selection = new Selection({
        onSelectionChanged: () => {
            _setSelectedItemsOnDataSet()
        }
    }); 
    
    // sets the selected record id's on the Dynamics dataset.
    // this will allow us to utilize the ribbon buttons since they need
    // that data set in order to do things such as delete/deactivate/activate/ect..
    const _setSelectedItemsOnDataSet = () => {
        let selectedKeys = [];
        let selections = _selection.getSelection();
        for (let selection of selections)
        {
            selectedKeys.push(selection.key as string);
        }
        setSelectedItemCount(selectedKeys.length);
        props.pcfContext.parameters.sampleDataSet.setSelectedRecordIds(selectedKeys);
    }      

    // when a column header is clicked sort the items
    const _onColumnClick = (ev?: React.MouseEvent<HTMLElement>, column?: IColumn): void => {
        let isSortedDescending = column?.isSortedDescending;
    
        // If we've sorted this column, flip it.
        if (column?.isSorted) {
          isSortedDescending = !isSortedDescending;
        }

        // Reset the items and columns to match the state.
        setItems(copyAndSort(items, column?.fieldName!, props.pcfContext, isSortedDescending));
        setColumns(
            columns.map(col => {
                col.isSorted = col.key === column?.key;
                col.isSortedDescending = isSortedDescending;
                return col;
            })
        );
    }      
    
    const _onRenderDetailsHeader = (props: IDetailsHeaderProps | undefined, defaultRender?: IRenderFunction<IDetailsHeaderProps>): JSX.Element => {
        return (
            <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
                {defaultRender!({
                    ...props!,
                    onRenderColumnHeaderTooltip: (tooltipHostProps: ITooltipHostProps | undefined) => <TooltipHost {...tooltipHostProps} />
                })}
            </Sticky>
        )
    }

    return (   
        <Stack grow
            styles={{
                root: {
                  width: "100%",
                  height: "inherit",
                },
              }}>
        <Stack.Item 
            verticalFill 
                styles={{
                    root: {
                        height: "100%",
                        overflowY: "auto",
                        overflowX: "auto",
                    },
                }}
                  >
        <div 
            style={{ position: 'relative', height: '100%' }}>
        <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>            
                <ShimmeredDetailsList
                        enableShimmer={!isDataLoaded}
                        className = 'list'                        
                        items={items}
                        columns= {columns}
                        setKey="set"                                                                                         
                        selection={_selection} // updates the dataset so that we can utilize the ribbon buttons in Dynamics                                        
                        onColumnHeaderClick={_onColumnClick} // used to implement sorting for the columns.                    
                        selectionPreservedOnEmptyClick={true}
                        ariaLabelForSelectionColumn="Toggle selection"
                        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                        checkButtonAriaLabel="Row checkbox"                        
                        selectionMode={SelectionMode.multiple}
                        onRenderDetailsHeader={_onRenderDetailsHeader}
                        layoutMode = {DetailsListLayoutMode.justified}
                        constrainMode={ConstrainMode.unconstrained}
                    />       
        </ScrollablePane>
        </div>
        </Stack.Item>
        <Stack.Item align="start">
            <div className="detailList-footer">
               <Label className="detailList-gridLabels">Records: {items.length.toString()} ({selectedItemCount} selected)</Label>               
            </div>
        </Stack.Item>
        </Stack>             
    );
};

// navigates to the record when user clicks the link in the grid.
const navigate = (item: any, linkReference: string | undefined, pcfContext: ComponentFramework.Context<IInputs>) => {        
    pcfContext.parameters.sampleDataSet.openDatasetItem(item[linkReference + "_ref"])
};

// get the items from the dataset
const getItems = (columns: IColumn[], pcfContext: ComponentFramework.Context<IInputs>) => {
    let dataSet = pcfContext.parameters.sampleDataSet;

    var resultSet = dataSet.sortedRecordIds.map(function (key) {
        var record = dataSet.records[key];
        var newRecord: any = {
            key: record.getRecordId()
        };

        for (var column of columns)
        {                
            newRecord[column.key] = record.getFormattedValue(column.key);
            if (isEntityReference(record.getValue(column.key)))
            {
                var ref = record.getValue(column.key) as ComponentFramework.EntityReference;
                newRecord[column.key + '_ref'] = ref;
            }
            else if(column.data.isPrimary)
            {
                newRecord[column.key + '_ref'] = record.getNamedReference();
            }
        }            

        return newRecord;
    });          
            
    return resultSet;
}  

 // get the columns from the dataset
const getColumns = (pcfContext: ComponentFramework.Context<IInputs>) : IColumn[] => {
    let dataSet = pcfContext.parameters.sampleDataSet;
    let iColumns: IColumn[] = [];

    let columnWidthDistribution = getColumnWidthDistribution(pcfContext);

    for (var column of dataSet.columns){
        let iColumn: IColumn = {
            key: column.name,
            name: column.displayName,
            fieldName: column.alias,
            currentWidth: column.visualSizeFactor,
            minWidth: 5,                
            maxWidth: columnWidthDistribution.find(x => x.name === column.alias)?.width ||column.visualSizeFactor,
            isResizable: true,
            sortAscendingAriaLabel: 'Sorted A to Z',
            sortDescendingAriaLabel: 'Sorted Z to A',
            className: 'detailList-cell',
            headerClassName: 'detailList-gridLabels',
            data: {isPrimary : column.isPrimary} 
        }
        
        //create links for primary field and entity reference.            
        if (column.dataType.startsWith('Lookup.') || column.isPrimary)
        {
            iColumn.onRender = (item: any, index: number | undefined, column: IColumn | undefined)=> (                                    
                <Link key={item.key} onClick={() => navigate(item, column!.fieldName, pcfContext) }>{item[column!.fieldName!]}</Link>                    
            );
        }
        else if(column.dataType === 'SingleLine.Email'){
            iColumn.onRender = (item: any, index: number | undefined, column: IColumn | undefined)=> (                                    
                <Link href={`mailto:${item[column!.fieldName!]}`} >{item[column!.fieldName!]}</Link>  
            );
        }
        else if(column.dataType === 'SingleLine.Phone'){
            iColumn.onRender = (item: any, index: number | undefined, column: IColumn | undefined)=> (                                    
                <Link href={`skype:${item[column!.fieldName!]}?call`} >{item[column!.fieldName!]}</Link>                    
            );
        }

        //set sorting information
        let isSorted = dataSet?.sorting?.findIndex(s => s.name === column.name) !== -1 || false
        iColumn.isSorted = isSorted;
        if (isSorted){
            iColumn.isSortedDescending = dataSet?.sorting?.find(s => s.name === column.name)?.sortDirection === 1 || false;
        }

        iColumns.push(iColumn);
    }
    return iColumns;
}   

const getColumnWidthDistribution = (pcfContext: ComponentFramework.Context<IInputs>): IColumnWidth[] => {
        
    let widthDistribution: IColumnWidth[] = [];
    let columnsOnView = pcfContext.parameters.sampleDataSet.columns;

    // Considering need to remove border & padding length
    let totalWidth:number = pcfContext.mode.allocatedWidth - 250;
    //console.log(`new total width: ${totalWidth}`);
    let widthSum = 0;
    
    columnsOnView.forEach(function (columnItem) {
        widthSum += columnItem.visualSizeFactor;
    });

    let remainWidth:number = totalWidth;
    
    columnsOnView.forEach(function (item, index) {
        let widthPerCell = 0;
        if (index !== columnsOnView.length - 1) {
            let cellWidth = Math.round((item.visualSizeFactor / widthSum) * totalWidth);
            remainWidth = remainWidth - cellWidth;
            widthPerCell = cellWidth;
        }
        else {
            widthPerCell = remainWidth;
        }
        widthDistribution.push({name: item.alias, width: widthPerCell});
    });

    return widthDistribution;

}

// Updates the column widths based upon the current side of the control on the form.
const updateColumnWidths = (columns: IColumn[], pcfContext: ComponentFramework.Context<IInputs>) : IColumn[] => {
    let columnWidthDistribution = getColumnWidthDistribution(pcfContext);        
    let currentColumns = columns;    

    //make sure to use map here which returns a new array, otherwise the state/grid will not update.
    return currentColumns.map(col => {           

        var newMaxWidth = columnWidthDistribution.find(x => x.name === col.fieldName);
        if (newMaxWidth) col.maxWidth = newMaxWidth.width;

        return col;
      });        
}

//sort the items in the grid.
const copyAndSort = <T, >(items: T[], columnKey: string, pcfContext: ComponentFramework.Context<IInputs>, isSortedDescending?: boolean): T[] =>  {
    let key = columnKey as keyof T;
    let sortedItems = items.slice(0);        
    sortedItems.sort((a: T, b: T) => (a[key] || '' as any).toString().localeCompare((b[key] || '' as any).toString(), getUserLanguage(pcfContext), { numeric: true }));

    if (isSortedDescending) {
        sortedItems.reverse();
    }

    return sortedItems;
}

const getUserLanguage = (pcfContext: ComponentFramework.Context<IInputs>): string => {
    var language = lcid.from(pcfContext.userSettings.languageId);
    return language.substring(0, language.indexOf('_'));
} 

// determine if object is an entity reference.
const isEntityReference = (obj: any): obj is ComponentFramework.EntityReference => {
    return typeof obj?.etn === 'string';
}