import * as React from 'react';
import {IInputs} from "./generated/ManifestTypes";
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { IRenderFunction, SelectionMode } from 'office-ui-fabric-react/lib/Utilities';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn, ConstrainMode, IDetailsFooterProps, IDetailsHeaderProps } from 'office-ui-fabric-react/lib/DetailsList';
import { TooltipHost, ITooltipHostProps } from 'office-ui-fabric-react/lib/Tooltip';
import { initializeIcons } from '@uifabric/icons';
import * as lcid from 'lcid';

export interface IProps {
    pcfContext: ComponentFramework.Context<IInputs> 
}

interface IColumnWidth {
    name: string,
    width: number
}

initializeIcons();

export const DetailListGridControl: React.FC<IProps> = (props) => {        

    // navigates to the record when user clicks the link in the grid.
    const _navigate = (item: any, linkReference: string | undefined) => {        
        props.pcfContext.parameters.sampleDataSet.openDatasetItem(item[linkReference + "_ref"])
    };

    // determine if object is an entity reference.
    const _isEntityReference = (obj: any): obj is ComponentFramework.EntityReference => {
        return typeof obj?.etn === 'string';
    }

    // the selector used by the DetailList
    const _selection = new Selection({
        onSelectionChanged: () => {
            _setSelectedItemsOnDataSet()
        }
    });

    // react hook to store the number of selected items in the grid which will be displayed in the grid footer.
    const [selectedItemCount, setSelectedItemCount] = React.useState(0);

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

    // get the items from the dataset
    const _getItems = () => {
        let dataSet = props.pcfContext.parameters.sampleDataSet;
    
        var resultSet = dataSet.sortedRecordIds.map(function (key) {
            var record = dataSet.records[key];
            var newRecord: any = {
                key: record.getRecordId()
            };
    
            for (var column of columns)
            {                
                newRecord[column.key] = record.getFormattedValue(column.key);
                if (_isEntityReference(record.getValue(column.key)))
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
    const _getColumns = () : IColumn[] => {
        let dataSet = props.pcfContext.parameters.sampleDataSet;
        let iColumns: IColumn[] = [];

        let columnWidthDistribution = _getColumnWidthDistribution();

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
                    <Link key={item.key} onClick={() => _navigate(item, column!.fieldName) }>{item[column!.fieldName!]}</Link>                    
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

    const _getColumnWidthDistribution = (): IColumnWidth[] => {
        
        let widthDistribution: IColumnWidth[] = [];
        let columnsOnView = props.pcfContext.parameters.sampleDataSet.columns;

        // Considering need to remove border & padding length
        let totalWidth:number = props.pcfContext.mode.allocatedWidth - 250;
        console.log(`new total width: ${totalWidth}`);
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
    
    // using react hooks to create functional which will allow us to set these values in our code
    // eg. when we calculate the columns we can then udpate the state of them using setColums([our new columns]);
    // we have passed in an empty array as the default.
    // const [columns, setColumns] = React.useState(_getColumns);
    // const [items, setItems] = React.useState(_getItems);
    const [columns, setColumns] = React.useState(_getColumns);
    const [items, setItems] = React.useState(_getItems);
    
    // When the component is updated this will determine if the sampleDataSet has changed.  
    // If it has we will go get the udpated items.
    React.useEffect(() => {
        console.log('sampleDataSet was updated');
        setItems(_getItems);
        }, [props.pcfContext.parameters.sampleDataSet]);  
    
    // When the component is updated this will determine if the width of the control has changed.
    // If so the column widths will be adjusted.
    React.useEffect(() => {
        console.log('width was updated');
        setColumns(_updateColumnWidths);
        }, [props.pcfContext.mode.allocatedWidth]);        
    
    // Updates the column widths based upon the current side of the control on the form.
    const _updateColumnWidths = () : IColumn[] => {
        let columnWidthDistribution = _getColumnWidthDistribution();        
        let currentColumns = columns;    

        //make sure to use map here which returns a new array, otherwise the state/grid will not update.
        return currentColumns.map(col => {           
    
            var newMaxWidth = columnWidthDistribution.find(x => x.name === col.fieldName);
            if (newMaxWidth) col.maxWidth = newMaxWidth.width;
    
            return col;
          });        
    }

    // when a column header is clicked sort the items
    const _onColumnClick = (ev?: React.MouseEvent<HTMLElement>, column?: IColumn): void => {
        let isSortedDescending = column?.isSortedDescending;
    
        // If we've sorted this column, flip it.
        if (column?.isSorted) {
          isSortedDescending = !isSortedDescending;
        }

        // Reset the items and columns to match the state.
        setItems(_copyAndSort(items, column?.fieldName!, isSortedDescending));
        setColumns(
            columns.map(col => {
                col.isSorted = col.key === column?.key;
                col.isSortedDescending = isSortedDescending;
                return col;
            })
        );
    }

    //sort the items in the grid.
    const _copyAndSort = <T, >(items: T[], columnKey: string, isSortedDescending?: boolean): T[] =>  {
        let key = columnKey as keyof T;
        let sortedItems = items.slice(0);        
        sortedItems.sort((a: T, b: T) => (a[key] || '' as any).toString().localeCompare((b[key] || '' as any).toString(), _getUserLanguage(), { numeric: true }));

        if (isSortedDescending) {
            sortedItems.reverse();
        }

        return sortedItems;
    }    

    const _getUserLanguage = (): string => {
        var language = lcid.from(props.pcfContext.userSettings.languageId);
        return language.substring(0, language.indexOf('_'));
    } 

    const _onRenderDetailsFooter = (props: IDetailsFooterProps | undefined, defaultRender?: IRenderFunction<IDetailsFooterProps>): JSX.Element => {
        return (
          <Sticky stickyPosition={StickyPositionType.Footer} isScrollSynced={true}>
            <div className="detailList-footer">
               <Label className="detailList-gridLabels">Records: {items.length.toString()} ({selectedItemCount} selected)</Label>
            </div>
          </Sticky>
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
    <Fabric>
        <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>            
                <DetailsList
                        className = 'list'
                        items={items}
                        columns= {columns}
                        setKey="set"                                                                                         
                        selection={_selection} // udpates the dataset so that we can utilize the ribbon buttons in Dynamics                                        
                        onColumnHeaderClick={_onColumnClick} // used to implement sorting for the columns.                    
                        selectionPreservedOnEmptyClick={true}
                        ariaLabelForSelectionColumn="Toggle selection"
                        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                        checkButtonAriaLabel="Row checkbox"                        
                        selectionMode={SelectionMode.multiple}
                        onRenderDetailsHeader={_onRenderDetailsHeader}
                        onRenderDetailsFooter={_onRenderDetailsFooter} 
                        layoutMode = {DetailsListLayoutMode.justified}
                        constrainMode={ConstrainMode.unconstrained}
                    />       
        </ScrollablePane>                
    </Fabric>
    );
};