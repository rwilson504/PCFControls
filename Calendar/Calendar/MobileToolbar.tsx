import * as PropTypes from 'prop-types'
import * as React from 'react';
import clsx from 'clsx'
import * as Color from 'color'
import { ToolbarProps, NavigateAction, View, Messages } from 'react-big-calendar'
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { CommandBarButton, IButtonProps } from '@fluentui/react/lib/Button';
import { CommandBar, ICommandBarItemProps, ICommandBarData, } from '@fluentui/react/lib/CommandBar';
import { IContextualMenuItemProps, IContextualMenuItem, ContextualMenuItem,  IContextualMenuItemStyles,  IContextualMenuStyles,} from '@fluentui/react/lib/ContextualMenu';
import { getTheme, concatStyleSets } from '@fluentui/react/lib/Styling';
import { IButtonStyles } from '@fluentui/react/lib/Button';
import { memoizeFunction } from '@fluentui/react/lib/Utilities';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import {useSwipeable} from 'react-swipeable';

const overflowProps: IButtonProps = { ariaLabel: 'More commands' };

initializeIcons();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MobileToolbar: React.FC<ToolbarProps<Event, any>> = (props) =>  {
  const messages = props.localizer.messages;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getViewNamesGroup = (messages: any) : IContextualMenuItem[] => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const viewNames: any = props.views
    const view = props.view

    if (viewNames.length > 1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return viewNames.map((name: any) => (
            {
                key : name,
                text : messages[name],
                onClick : () => props.onView(name),
                ariaLabel: messages[name]
            }
      ));
    }

    return [];
  }
  const [viewNamesGroup] = React.useState<IContextualMenuItem[]>(getViewNamesGroup(messages));

  const navigate = (action: NavigateAction): void => {
    props.onNavigate(action)
  }

  const getItems = (): ICommandBarItemProps[] => {
    const items: ICommandBarItemProps[] = [{
      key: 'today',
      text: `${messages.today}`,
      iconProps: { iconName: 'GotoToday' },
      iconOnly: false,
      onClick: navigate.bind(null, 'TODAY'),
      ariaLabel: `${messages.today}`,
      buttonStyles: buttonStyle
    },
    {
      key: 'previous',
      text: `${messages.previous}`,
      iconProps: { iconName: 'ChevronLeft' },
      iconOnly: false,
      onClick: navigate.bind(null, 'PREV'),
      ariaLabel: `${messages.previous}`,
      buttonStyles: buttonStyle
    },
    {
      key: 'next',
      text: `${messages.next}`,
      iconProps: { iconName: 'ChevronRight' },
      iconOnly: false,
      onClick: navigate.bind(null, 'NEXT'),
      ariaLabel: `${messages.next}`,
      buttonStyles: buttonStyle
    }];

    if (viewNamesGroup.length > 1) {
      items.push({
          key: 'view',
          text: `${messages[props.view]}`,
          iconProps: { iconName: 'Event' },
          subMenuProps: {
            // Must specify the menu item type for submenus too!
            // contextualMenuItemAs: CustomMenuItem,
            // Styles are passed through to menu items here
            styles: menuStyles,
            items: viewNamesGroup,        
          },
          buttonStyles: buttonStyle
        });
    }

    items.push(
      {
        key: 'dates',
        text: `${props.label}`,        
        disabled: true,
        buttonStyles: buttonStyle        
      }
    );

    return items;
  };  

  const [menuItems, setMenuItems] = React.useState<ICommandBarItemProps[]>(getItems());
  const handlers = useSwipeable({
      onSwipedLeft: (eventData) => navigate.bind(null, 'PREV'),
      onSwipedRight: (eventData) => navigate.bind(null,'NEXT'),
      trackMouse: true
    });
  const theme = getTheme();

  const buttonStyle: Partial<IButtonStyles> = {    
      root: {
        color: ToolbarColor?.textColor?.toString() || '',
        backgroundColor: 'transparent'   
      },
      rootHovered: {
        backgroundColor: ToolbarColor?.textColor?.fade(.6)?.toString() || ''
      },
      rootPressed: {
        backgroundColor: ToolbarColor?.textColor?.fade(.7)?.toString() || ''
      }
  };

  const itemStyles: Partial<IContextualMenuItemStyles> = {
    root: {
      backgroundColor: 'transparent',
      color: ToolbarColor?.textColor?.toString() || '',
      fontSize: 14
    },   
  };

  // For passing the styles through to the context menus
  const menuStyles: Partial<IContextualMenuStyles> = {
    root: {
      backgroundColor: 'transparent'
    },    
    subComponentStyles: {       
      menuItem: itemStyles, 
      callout: {}       
    },    
  };

  const getCommandBarButtonStyles = memoizeFunction(
    (originalStyles: IButtonStyles | undefined): Partial<IContextualMenuItemStyles> => {
      if (!originalStyles) {
        return itemStyles;
      }
  
      return concatStyleSets(originalStyles, itemStyles);
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _onReduceData = (data: ICommandBarData): any =>{
    if (data.primaryItems[0].key === 'dates') return undefined;
    if (data.primaryItems[0].iconOnly === true)
    {
      const firstItem = data.primaryItems[0];
      data.primaryItems.shift();
      data.overflowItems.push(firstItem);
    }
    else
    {
      data.primaryItems.forEach((item: ICommandBarItemProps) => { if (item.iconProps) item.iconOnly = true});
      return data;
    }
  }
           
  return (
    <div {...handlers} >
    {/* <div className="rbc-toolbar">
    <div className="rbc-btn-group"> */}
        <div>
        <CommandBar 
          items={getItems()}
          shiftOnReduce={true}
          //farItems={farItems}
          // onReduceData={_onReduceData}
          overflowButtonProps={overflowProps}
          styles={{
            root: {
              backgroundColor: 'transparent',
              padding: 0, 
              height: 35
            }            
          }}
        />
        </div>
        {/* <div>
          {props.label}
        </div> */}
        {/* <button
          type="button"
          onClick={navigate.bind(null, 'TODAY')}
        >
          {messages.today}
        </button>
        <button
          type="button"
          onClick={navigate.bind(null, 'PREV')}
        >
          {messages.previous}
        </button>
        <button
          type="button"
          onClick={navigate.bind(null, 'NEXT')}
        >
          {messages.next}
        </button> */}
      
      {/* <div className="rbc-btn-group">{this.viewNamesGroup(messages)}</div> */}
      {/* <div><Dropdown 
          options={viewNamesGroup(messages)} 
          defaultSelectedKey={props.view}
          onChange={onChange}          
          styles={{root: {width: 100}}}
          selectedKey={selectedItem ? selectedItem.key : undefined}
      />
      </div> */}
      {/* <div className="rbc-toolbar-label">{props.label}</div>
    </div> */}
    </div>
  )
}

export const ToolbarColor = { 
  textColor: Color(),
  borderColor: Color()
}
// export default MobileToolbar

//   viewNamesGroup(messages) {
//     let viewNames = this.props.views
//     const view = this.props.view

//     if (viewNames.length > 1) {
//       return viewNames.map(name => (
//         <button
//           type="button"
//           key={name}
//           className={clsx({ 'rbc-active': view === name })}
//           onClick={this.view.bind(null, name)}
//         >
//           {messages[name]}
//         </button>
//       ))
//     }
//   }

// MobileToolbar.propTypes = {
//   view: PropTypes.View.isRequired,
//   views: PropTypes.arrayOf(PropTypes.string).isRequired,
//   label: PropTypes.node.isRequired,
//   localizer: PropTypes.object,
//   onNavigate: PropTypes.func.isRequired,
//   onView: PropTypes.func.isRequired,
// }