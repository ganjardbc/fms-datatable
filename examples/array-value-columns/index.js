import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src";
import Chip from '@material-ui/core/Chip';

class Example extends React.Component {

  constructor() {
    super();
    this.state = {
      isSelectedActive: true
    };
  }

  render() {
    // const allTags = ['leave-message', 'frequently-busy', 'nice', 'grumpy', 'in-person', 'preferred', 'second-choice'];
    const columns = [
      {
        name: "Name",
        options: {
          filter: true,
          display: 'excluded',
        }
      },      
      {
        label: "Modified Title Label",
        name: "Title",
        options: {
          filter: true,
        }
      },
      {
        name: "Location",
        options: {
          print: false,
          filter: false,
        }
      },
      {
        name: "Age",
        options: {
          filter: true,
          print: false,
        }
      },
      {
        name: "Salary",
        options: {
          filter: true,
          sort: false
        }
      },
      {
        name: 'Tags',
        options: {
            filter: true,
            filterType: 'multiselect',
            customBodyRender: (value) => {
                return value.map( (val, key) => {
                    return <Chip label={val} key={key} />;
                });
            }
        }
      },
      {
        name: "Actions",
        options: {
            filter: false,
            customHeadRender: (columnMeta) => (
                <th key={columnMeta.index} style={{ 
                  cursor: 'pointer', 
                  fontSize: 13, 
                  fontWeight: 1, 
                  textAlign: "right", 
                  paddingRight: "60px", 
                  top: 0, 
                  position: "sticky", 
                  backgroundColor: "#fff", 
                  zIndex: 100 
                }} scope="col">
                    {columnMeta.name}
                </th>
            ),
            customBodyRender: () => {
                return (
                    <div className="display-flex-normal" style={{ justifyContent: "flex-end" }}>
                        <button 
                            className="btn btn-grey btn-small-circle"
                            onClick={ () => console.log('edit') }>
                            edit
                        </button>
                        <button 
                            className="btn btn-grey btn-small-circle"
                            onClick={ () => console.log('edit') }>
                            delete
                        </button>
                        <button 
                            className="btn btn-grey btn-small-circle"
                            onClick={ () => console.log('edit') }>
                            view
                        </button>
                    </div>
                );
            }
        }
      }
    ];


    const data = [
      ["Gabby George", "Business Analyst", "Minneapolis", 30, "$100,000", ['nice', 'preferred']],
      ["Aiden Lloyd", "Business Consultant", "Dallas",  55, "$200,000", ['grumpy', 'second-choice']],
      ["Jaden Collins", "Attorney", "Santa Ana", 27, "$500,000", ['frequently-busy', 'leave-message']],
      ["Franky Rees", "Business Analyst", "St. Petersburg", 22, "$50,000", ['in-person', 'nice']],
      ["Aaren Rose", "Business Consultant", "Toledo", 28, "$75,000", ['preferred']],
      ["Blake Duncan", "Business Management Analyst", "San Diego", 65, "$94,000", ['nice']],
      ["Frankie Parry", "Agency Legal Counsel", "Jacksonville", 71, "$210,000", ['nice', 'preferred']],
      ["Lane Wilson", "Commercial Specialist", "Omaha", 19, "$65,000", ['frequently-busy', 'leave-message']],
      ["Robin Duncan", "Business Analyst", "Los Angeles", 20, "$77,000", ['frequently-busy', 'leave-message', 'nice']],
      ["Mel Brooks", "Business Consultant", "Oklahoma City", 37, "$135,000", ['grumpy', 'second-choice']],
      ["Harper White", "Attorney", "Pittsburgh", 52, "$420,000", ['preferred']],
      ["Kris Humphrey", "Agency Legal Counsel", "Laredo", 30, "$150,000", ['preferred']],
      ["Frankie Long", "Industrial Analyst", "Austin", 31, "$170,000", ['preferred']],
      ["Brynn Robbins", "Business Analyst", "Norfolk", 22, "$90,000", ['preferred']],
      ["Justice Mann", "Business Consultant", "Chicago", 24, "$133,000", ['preferred']],
      ["Addison Navarro", "Business Management Analyst", "New York", 50, "$295,000", ['preferred']],
      ["Jesse Welch", "Agency Legal Counsel", "Seattle", 28, "$200,000", ['preferred']],
      ["Eli Mejia", "Commercial Specialist", "Long Beach", 65, "$400,000", ['preferred']],
      ["Gene Leblanc", "Industrial Analyst", "Hartford", 34, "$110,000", ['preferred']],
      ["Danny Leon", "Computer Scientist", "Newark", 60, "$220,000", ['preferred']],
      ["Lane Lee", "Corporate Counselor", "Cincinnati", 52, "$180,000", ['preferred']],
      ["Jesse Hall", "Business Analyst", "Baltimore", 44, "$99,000", ['preferred']],
      ["Danni Hudson", "Agency Legal Counsel", "Tampa", 37, "$90,000", ['preferred']],
      ["Terry Macdonald", "Commercial Specialist", "Miami", 39, "$140,000", ['preferred']],
      ["Justice Mccarthy", "Attorney", "Tucson", 26, "$330,000", ['preferred']],
      ["Silver Carey", "Computer Scientist", "Memphis", 47, "$250,000" , ['preferred']],
      ["Franky Miles", "Industrial Analyst", "Buffalo", 49, "$190,000", ['preferred']],
      ["Glen Nixon", "Corporate Counselor", "Arlington", 44, "$80,000", ['preferred']],
      ["Gabby Strickland", "Business Process Consultant", "Scottsdale", 26, "$45,000", ['preferred']],
      ["Mason Ray", "Computer Scientist", "San Francisco", 39, "$142,000", ['preferred']]
    ];

    const options = {
      download: true,
      print: true,
      filter: true,
      filterType: 'dropdown',
      responsive: 'scrollMaxHeight',
      selectableRows: 'multiple',
      // rowsSelected: [0, 3],
      disableToolbarSelect: false,
      onRowsSelect: (rowData) => {
        // this.setState({isSelectedActive: true});
      }
    };

    return (
      <div>
        <MUIDataTable 
          title={"ACME Employee list"} 
          subtitle={"All data is set"} 
          data={data} 
          columns={columns} 
          options={options} 
          isSelectedActive={this.state.isSelectedActive}
          circularProgress={false}
          linearProgress={false}
          toolbarRender={<div style={{width: "100%"}}>Toolbar Render Component</div>}
          buttonReactiveSearch={true}
          buttonSearch={true}
          onSearch={(data) => {
            alert('this is search handled => ' + data);
          }}
          buttonUpload={true}
          onUpload={() => {
            alert('this is upload handled');
          }}
          buttonCreate={true}
          onCreate={() => {
            alert('this is create handle');
          }} 
          buttonPrint={true}
          onPrint={() => {
            alert('this is print handle');
          }}
          buttonDownload={true}
          onDownload={() => {
            alert('this is download handle');
          }} 
        />
      </div>
    );

  }
}

export default Example;
