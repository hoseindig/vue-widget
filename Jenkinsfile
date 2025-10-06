pipeline {
    agent any
    stages{
        stage("Clean & Build") {
            when{
                expression {
                    GIT_BRANCH.contains("trunk")
                }
            }

            steps {
                script {
                  	bat """
						npm install
					""" 
                    
                  	bat """
						npm ci
					"""   
					
					bat """
						npm run build
					"""   
                }
            }
        }

        stage("Publish") {
            when{
                expression {
                    GIT_BRANCH.contains("trunk")
                }
            }
    
            steps {
                script{
                    bat "echo D | xcopy /s /y dist \\\\3dxlab4\\E\$\\DassaultSystemes\\R2023x\\3DDashboard\\win_b64\\code\\EDMPWidgets\\widgets\\CW"
                }
            }
        }
      
      	stage("Delete & Register Widget") {
        	steps {
            	script {
                	def widgetHandler = new ir.ed.jenkins.util.dashboard.WidgetHandler("https://3dxlab4.plm.ir")
                    widgetHandler.authenticate("RDVCRUEzQkZBNDJENEMzOUExNkEwNEMxQzBFQkQ4M0R8YWRtaW5fcGxhdGZvcm18fHx8MHw=").findWidgetId("cw-02").getCSRFToken().deleteWidget().registerWidget("https://3dxlab4.plm.ir/widgets/CW/index.html")
                }
            }
        }
    }
}
