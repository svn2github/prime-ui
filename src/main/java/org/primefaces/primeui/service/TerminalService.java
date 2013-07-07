/*
 * Copyright 2009-2013 PrimeTek.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.primefaces.primeui.service;

import java.util.Date;
import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/terminal")
public class TerminalService {
    
    @GET
    @Path("{command}-{params}")
    @Produces(MediaType.TEXT_PLAIN)
    public String handleCommand(@PathParam("command") String command, @PathParam("params") List<String> params) {
		if(command.equals("greet")) {
            if(!"-".equals(params.get(0)))
                return "Hello " + params.get(0);
            else
                return "Hello Stranger";
        }
		else if(command.equals("date"))
			return new Date().toString();
		else
			return command + " not found";
	}  
    
    
}
