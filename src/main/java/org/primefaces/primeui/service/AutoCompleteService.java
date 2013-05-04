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

import java.awt.print.Book;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import javax.xml.bind.JAXBElement;

@Path("/autocomplete")
public class AutoCompleteService {

    @Context
    private UriInfo uriInfo;
    
    @GET
    @Path("{query}")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Suggestion> getSuggestions(@PathParam("query") String query) {
        List<Suggestion> suggestions = new ArrayList<Suggestion>();
        for (int i = 0; i < 10; i++) {
            String label = query + i;
            String value = label + "_value";

            suggestions.add(new Suggestion(label, value));
        }

        return suggestions;
    }

    @POST
    @Path("/save")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createNewBook(Suggestion suggestion) {
        System.out.println(suggestion.getLabel() + "," + suggestion.getValue());

        return Response.status(201).entity("suggestion saved").build();
    }
}
